# Complaint Management Scripts

This directory contains scripts for managing and testing the complaint system.

## Scripts

### 1. Migration Script (`migrateComplaints.js`)

**Purpose**: Fixes complaints that are missing the `user` field by assigning them to an existing admin user or creating a default admin user.

**Usage**:
```bash
npm run migrate
```

**What it does**:
- Connects to MongoDB using the `MONGODB_URI` environment variable
- Finds all complaints without a `user` field
- Assigns them to an existing admin user, or creates a default admin if none exists
- Verifies the migration was successful
- Tests population to ensure user data is properly linked

**Default Admin User** (if created):
- Email: `admin@citizen.com`
- Password: `admin123456`
- Role: `admin`

### 2. Test Script (`testComplaints.js`)

**Purpose**: Verifies that the complaint system is working correctly after migration.

**Usage**:
```bash
npm run test-complaints
```

**What it tests**:
1. **User Field Presence**: Ensures all complaints have a `user` field
2. **Valid ObjectIds**: Checks that all complaints have valid user ObjectIds
3. **Population**: Tests that user data is properly populated
4. **Consistency**: Verifies population consistency across complaints
5. **Role-based Filtering**: Simulates admin vs citizen views

## Environment Variables

Make sure you have the following environment variable set in your `.env` file:

```
MONGODB_URI=mongodb://localhost:27017/citizen
```

## Workflow

1. **Run Migration** (if needed):
   ```bash
   npm run migrate
   ```

2. **Test the System**:
   ```bash
   npm run test-complaints
   ```

3. **Restart the Server**:
   ```bash
   npm run dev
   ```

## Notes

- The migration script is safe to run multiple times - it will only update complaints that need fixing
- The test script will help you verify that everything is working correctly
- Both scripts use ESM imports and are compatible with the existing codebase
