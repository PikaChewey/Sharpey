# Troubleshooting Guide

## Common Issues and Solutions

### 1. "Invariant: missing bootstrap script" Error

This error typically occurs due to cache corruption in Next.js:

**Solution:**

```bash
# Run the simple startup script (recommended)
npm run dev:simple

# OR run the clean start script
npm run clean-start
```

### 2. Port Already in Use

If you see errors about ports being in use:

**Solution:**

```bash
# Kill processes using ports 3000-3010
npm run killports

# Then start the app
npm run dev:simple
```

### 3. Complete Reset

For persistent issues, you may need a complete reset:

**Solution:**

```bash
npm run clean-full
```

This will:

1. Kill all Node.js processes
2. Remove the Next.js cache
3. Remove node_modules
4. Clear npm cache
5. Reinstall all dependencies
6. Rebuild the app
7. Start the server

### 4. Manual Steps

If the scripts don't work, try these manual steps:

1. Close all terminals and command prompts
2. Open Task Manager and end all Node.js processes
3. Delete the `.next` folder
4. Run `npm install`
5. Run `npm run build`
6. Start the server with `npx next dev --no-turbo -p 3000`

## Prevention

To prevent these issues in the future:

1. Always use `npm run dev:simple` to start the server
2. Make sure to properly shut down the server when done
3. Don't run multiple instances at the same time
