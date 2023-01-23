import dotenv from "dotenv";

dotenv.config();

const enviroment = {
  url: process.env.MONGODB_URL,
  port: process.env.PORT,
  debug: process.env.DEBUG,
  jwtSecretKey: process.env.JWT_SECRET_KEY,
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseApiKey: process.env.SUPABASE_API_KEY,
  supabaseBucketImages: process.env.SUPABASE_BUCKET_IMAGES,
};

export default enviroment;
