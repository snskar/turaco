# Check if .env file exists, if not create it
if (-not (Test-Path .env)) {
    Write-Host "Creating .env file..."
    @"
DATABASE_URL="postgresql://postgres:lol***3000@localhost:5432/turaco_db"
NEXT_PUBLIC_APP_URL="http://localhost:3001"
"@ | Out-File -FilePath .env -Encoding UTF8
}

# Load environment variables
Get-Content .env | ForEach-Object {
    if ($_ -match '^([^=]+)=(.*)$') {
        $name = $matches[1]
        $value = $matches[2]
        [Environment]::SetEnvironmentVariable($name, $value, 'Process')
    }
}

# Push the database schema
Write-Host "Setting up database schema..."
npx prisma db push

# Create test data
Write-Host "Creating test gift..."
node -r ts-node/register scripts/testGiftAPI.ts

# Start the development server
Write-Host "Starting Next.js development server..."
npm run dev 