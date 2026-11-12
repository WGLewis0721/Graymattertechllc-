import Foundation
import Combine

/// Demo-only UserDefaults persistence; migrate intentionally for a real product.
@MainActor
final class StarterStore: ObservableObject {
    @Published private(set) var items: [StarterItem] = []
    @Published private(set) var canUndo = false
    @Published private(set) var storageError: String?

    private let defaults: UserDefaults
    private let key = "gm.starter.items.v1"
    private var removed: (item: StarterItem, index: Int)?

    init(defaults: UserDefaults = .standard) {
        self.defaults = defaults
        if let data = defaults.data(forKey: key) {
            do { items = try JSONDecoder().decode([StarterItem].self, from: data) }
            catch { storageError = "Saved tasks could not be read; existing data was not overwritten." }
        }
    }

    @discardableResult
    func add(title: String) -> Bool {
        guard let clean = normalized(title) else { return false }
        items.insert(StarterItem(title: clean), at: 0)
        persist()
        return true
    }

    @discardableResult
    func rename(id: UUID, title: String) -> Bool {
        guard let clean = normalized(title),
              let index = items.firstIndex(where: { $0.id == id }) else { return false }
        items[index].title = clean
        persist()
        return true
    }

    func toggle(id: UUID) {
        guard let index = items.firstIndex(where: { $0.id == id }) else { return }
        items[index].completed.toggle()
        persist()
    }

    func delete(id: UUID) {
        guard let index = items.firstIndex(where: { $0.id == id }) else { return }
        removed = (items.remove(at: index), index)
        canUndo = true
        persist()
    }

    func undoDelete() {
        guard let snapshot = removed else { return }
        if !items.contains(where: { $0.id == snapshot.item.id }) {
            items.insert(snapshot.item, at: min(snapshot.index, items.count))
            persist()
        }
        removed = nil
        canUndo = false
    }

    private func normalized(_ text: String) -> String? {
        let value = text.trimmingCharacters(in: .whitespacesAndNewlines)
        return value.isEmpty || value.count > 80 ? nil : value
    }

    private func persist() {
        do {
            defaults.set(try JSONEncoder().encode(items), forKey: key)
            storageError = nil
        } catch {
            storageError = "Unable to save changes."
        }
    }
}
