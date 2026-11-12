# Native iOS starter

SwiftUI + XcodeGen + XCTest, a working local-only task example, and a Codemagic unsigned simulator compile workflow.

For the **generated** app on macOS, set a unique bundle identifier and run:

    xcodegen generate --spec project.yml

Open the generated Xcode project, run a simulator, and execute XCTest. Codemagic is an optional cloud alternative for compilation but is not configured for signing or App Store release.

For production, implement your own identity, design tokens, data architecture, security, monetization and deployment, guided by app-design/IOS_PLAYBOOK.md and app-design/SECURITY_AND_RELEASE.md.
