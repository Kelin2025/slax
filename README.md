# Slax

Stop creating files/folders in your projects manually

## Installation

1. Install `slax` package from NPM

```bash
npm install -g slax
# or
yarn global add slax
```

2. Create a `slax.config.json`:

```bash
slax init
```

```json
{
  "templates": {}
}
```

## Creating templates

1. Open `slax.config.json` and create new template:

```json
{
  "templates": {
    "feat": []
  }
}
```

2. Add commands

```json
{
  "templates": {
    "feat": [
      {
        "type": "mkdir",
        "options": {
          "path": "./src/features/%n%"
        }
      },
      {
        "type": "writeFile",
        "options": {
          "path": "./src/features/%n%/index.ts",
          "content": [""]
        }
      }
    ]
  }
}
```

3. Execute it by using `slax`:

```bash
slax make feat -n myFeature
```

This will

- Create folder `./src/features/myFeature`
- Create a file `./src/features/myFeature/index.ts` with empty content

## Custom parameters

As you have noticed, we passed `-n` parameter to inject it to the options

You can pass any options you can, and `%optionName%` in `options` field will be automatically injected

## Commands list

### `mkdir` - Create folder

```json
{
  "type": "mkdir",
  "options": {
    "path": "./src/features/%n%"
  }
}
```

### `writeFile` - Create & Write to a File

```json
{
  "type": "writeFile",
  "options": {
    "path": "./src/features/%n%/atoms/%f%.ts",
    "content": [
      "export const %f = () => {", 
      "\treturn <div>Test</div>", 
      "}"
    ]
  }
}
```

### `appendFile` - Add extra content to your existing file

```json
{
  "type": "appendFile",
  "options": {
    "path": "./src/features/%n%/index.ts",
    "content": [
      "", 
      "export * from \"./atoms/%f%\""
    ]
  }
}
```

## TODO

- [ ] More commands
- [ ] Support for custom command types
