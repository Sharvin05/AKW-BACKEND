## Getting Started

## Installation
1. Install dependencies:
npm install

2. Create a .env local file in the root of the project and add your API URL:
FRONTEND="http://yourfrontend.com"
AWS_ACCESS_KEY_ID="<aws-access-key>" 
AWS_SECRET_ACCESS_KEY="<aws-secret-access>"
AWS_REGION="<aws-region>" 
S3_BUCKET_NAME="<bucket-name>" 
MONGO_URL="<mongo-url>" 
ACCESS_TOKEN_SECRET="your-jwt-secret" 
REFRESH_TOKEN_SECRET="your-jwt-refresh-secret"
AWS_SDK_JS_SUPPRESS_MAINTENANCE_MODE_MESSAGE=1 node my_program.js


3. Run the development server:
node server

