import XCTest
@testable import GrayMatterStarter

@MainActor
final class StarterStoreTests: XCTestCase {
    func testCreateEditToggleDeleteUndoAndPersist() {
        let suite = "gm.starter.tests.\(UUID().uuidString)"
        guard let defaults = UserDefaults(suiteName: suite) else {
            XCTFail("Could not make isolated defaults")
            return
        }
        defer { defaults.removePersistentDomain(forName: suite) }

        let store = StarterStore(defaults: defaults)
        XCTAssertFalse(store.add(title: " "))
        XCTAssertTrue(store.add(title: "First task"))
        XCTAssertEqual(store.items.count, 1)
        let id = store.items[0].id
        XCTAssertTrue(store.rename(id: id, title: "Edited task"))
        store.toggle(id: id)
        XCTAssertTrue(store.items[0].completed)

        let reloaded = StarterStore(defaults: defaults)
        XCTAssertEqual(reloaded.items[0].title, "Edited task")
        XCTAssertTrue(reloaded.items[0].completed)

        store.delete(id: id)
        XCTAssertTrue(store.items.isEmpty)
        XCTAssertTrue(store.canUndo)
        store.undoDelete()
        XCTAssertEqual(store.items.count, 1)
        XCTAssertFalse(store.canUndo)
    }
}
