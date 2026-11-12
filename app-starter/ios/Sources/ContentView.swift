import SwiftUI

struct ContentView: View {
    @EnvironmentObject private var store: StarterStore
    @State private var newTitle = ""
    @State private var editing: StarterItem?
    @State private var validationError: String?

    var body: some View {
        NavigationStack {
            List {
                Section {
                    VStack(alignment: .leading, spacing: 10) {
                        Text("Make the work happen.")
                            .font(.system(.largeTitle, design: .rounded, weight: .bold))
                        Text("Start with a real user journey; add polish with purpose.")
                            .foregroundStyle(.secondary)
                    }
                    .padding(.vertical, 12)
                }
                Section("New task") {
                    HStack {
                        TextField("What needs doing?", text: $newTitle)
                            .submitLabel(.done)
                            .onSubmit(add)
                            .accessibilityIdentifier("newTaskInput")
                        Button("Add", action: add)
                            .buttonStyle(.borderedProminent)
                    }
                    if let validationError {
                        Text(validationError)
                            .foregroundStyle(.red)
                            .font(.footnote)
                    }
                }
                Section {
                    if store.items.isEmpty {
                        ContentUnavailableView(
                            "A clean slate",
                            systemImage: "checklist",
                            description: Text("Tasks in this demo are saved only on this device.")
                        )
                    } else {
                        ForEach(store.items) { item in
                            HStack {
                                Button {
                                    store.toggle(id: item.id)
                                } label: {
                                    Image(systemName: item.completed ? "checkmark.circle.fill" : "circle")
                                        .font(.title3)
                                }
                                .accessibilityLabel(item.completed ? "Mark \(item.title) incomplete" : "Mark \(item.title) complete")

                                Text(item.title)
                                    .frame(maxWidth: .infinity, alignment: .leading)
                                    .strikethrough(item.completed)
                                    .foregroundStyle(item.completed ? .secondary : .primary)

                                Button("Edit") { editing = item }
                            }
                            .swipeActions(edge: .trailing) {
                                Button(role: .destructive) {
                                    store.delete(id: item.id)
                                } label: {
                                    Label("Delete", systemImage: "trash")
                                }
                            }
                        }
                    }
                } header: {
                    HStack {
                        Text("Today's tasks")
                        Spacer()
                        Text("\(store.items.filter(\.completed).count) / \(store.items.count) done")
                            .textCase(nil)
                    }
                }
                if let storageError = store.storageError {
                    Section {
                        Text(storageError).foregroundStyle(.red)
                    }
                }
            }
            .navigationTitle("Gray Matter")
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Undo") { store.undoDelete() }
                        .disabled(!store.canUndo)
                }
            }
            .sheet(item: $editing) { item in
                EditTaskView(item: item) { title in
                    store.rename(id: item.id, title: title)
                }
            }
        }
    }

    private func add() {
        if store.add(title: newTitle) {
            newTitle = ""
            validationError = nil
        } else {
            validationError = "Enter a title between 1 and 80 characters."
        }
    }
}

private struct EditTaskView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var draft: String
    let item: StarterItem
    let onSave: (String) -> Bool

    init(item: StarterItem, onSave: @escaping (String) -> Bool) {
        self.item = item
        self.onSave = onSave
        _draft = State(initialValue: item.title)
    }

    var body: some View {
        NavigationStack {
            Form {
                TextField("Task title", text: $draft)
            }
            .navigationTitle("Edit task")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") {
                        if onSave(draft) { dismiss() }
                    }
                    .disabled(draft.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty || draft.count > 80)
                }
            }
        }
    }
}
