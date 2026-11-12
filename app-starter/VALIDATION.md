# Starter validation

Run on a checkout of the Gray Matter business repository:

    bash -n app-starter/scripts/new-app.sh
    bash app-starter/scripts/new-app.sh web SampleWeb /tmp/gm-app-test
    cd /tmp/gm-app-test/SampleWeb && npm install && npm run test && npm run build
    bash app-starter/scripts/new-app.sh ios SampleIOS /tmp/gm-app-test

On macOS: inside SampleIOS, run xcodegen generate --spec project.yml and XCTest through Xcode. Alternatively connect to Codemagic for unsigned Simulator compilation.

These tests should be run for the generated project before relying on it. A full production build, deployment, device UX and App Store approval have not been verified. No commercial backend, auth, account deletion or payments are included.
