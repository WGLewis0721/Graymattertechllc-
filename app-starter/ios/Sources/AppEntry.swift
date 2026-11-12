import SwiftUI

@main
struct GrayMatterStarterApp: App {
    @StateObject private var store = StarterStore()

    var body: some Scene {
        WindowGroup {
            ContentView().environmentObject(store)
        }
    }
}
