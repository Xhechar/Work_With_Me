export interface SqlConfigurations {
  user: string,
  password: string,
  database: string,
  server: string,
  pool: {
    max: number,
    min: number,
    idleTimeoutMillis: number
  },
  options: {
    encrypt: boolean,
    trustServerCertificate: boolean
  }
}

export interface MailConfigurations {
  service: string,
  host: string,
  port: number,
  requireTLS: boolean,
  auth: {
    user: string,
    pass: string
  }
}

export interface MessageOptions {
  from: string,
  to: string,
  subject: string,
  html: string
}

export interface User { //TABLE
  user_id: string,
  fullname: string,
  id_number: number,
  country: string,
  county: string,
  ward: string,
  email: string,
  phone_number: string,
  role: string, //signing up as a manager/seeker
  profile_image: string,
  password: string,
  isDeleted: boolean,
  isWelcomed: boolean,
  prev_role?: string,
  job?: Job[]
}

export interface TokenDetails extends User {

}

export interface Recovery {
  recovery_id: string,
  email: string,
  verification_code: number,
  isRecovered: boolean
}

 //add this on accessing profile page
export interface IndividualDetails { //TABLE
  individual_id: string,
  seeker_id: string,
  service: string, //either expert or assistant
  certification_image: string,
  yoe: number, //as year of experience
  company_names: string
}

export interface Job { //TABLE
  job_id: string,
  job_name: string,
  owner_id: string,
  owner?: User,
  positions: string[],
  images: string[],
  country: string,
  county: string,
  ward: string,
  short_description: string,
  long_description: string,
  start_date: string | Date,
  duration: string,
  job_positions?: Position
}

export interface Position { //TABLE
  position_id: string,
  job_id: string,
  frequency: string[], //incase the job manager has a mumber of payment amount methods
  per_frequency: number[],
  price: number[]
}

export interface Messages { //TABLE
  message_id: string,
  sender_id: string,
  receiver_id: string,
  content: string,
  isRead: boolean,
  sent_date: string | Date,
  job_id: string,
  isGroup: boolean,
  isDeleted: boolean
}
 
export interface Wishlist { //TABLE
  wishlist_id: string,
  job_id: string,
  job: Job
}

export interface LoginDetails {
  email: string,
  password: string
}