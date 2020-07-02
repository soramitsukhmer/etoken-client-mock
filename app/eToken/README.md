# eToken Prompt Mock

- Open the `eToken.scpt` file with `Script Editor`
- Click on `File` -> `Export`.
- Export the script as `Application`
- Right click on `eToken.app` and click on `Show package content`

Open the `Info.plist` file and and add the followings to the end of the file before the last `</dict>`.

```xml
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLName</key>
        <string>SafeNet eToken</string>
        <key>CFBundleURLSchemes</key>
        <array>
        <string>token</string>
        </array>
    </dict>
</array>
```

Save the file and copy `eToken.app` to `Applications -> Utilities` filder.
Run the application once and you good to go.

## Source

- [Make your own custom URI scheme resolver](https://kaihao.dev/posts/Make-your-own-custom-URI-scheme-resolver)
