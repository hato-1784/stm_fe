export interface Stm {
  id: string;
  address: string;
  age: number;
  annual_income: number;
  annual_premium: number;
  annualized_premium_equivalent: number;
  application_date: string;
  contact_information: string;
  contract_completion_date: string;
  contract_type: string;
  date_of_birth: string;
  first_interview_date: string;
  last_name: string;
  first_name: string;
  last_name_kana: string;
  first_name_kana: string;
  gender: string;
  household: string;
  insurance_policy_end_date: string;
  insurance_policy_start_date: string;
  insurance_premium: number;
  insurance_type: string;
  number_of_visits: number;
  payment_method: string;
  postal_code: string;
  security_number: string;
  status: string;
  whole_life_insurance_flag: boolean;
  username: string;
  version: number;
  client_request_token: string;
}

export interface StmDetail {
  id: string;
  address: string;
  age: number;
  annual_income: number;
  annual_premium: number;
  annualized_premium_equivalent: number;
  application_date: string;
  contact_information: string;
  contract_completion_date: string;
  contract_type: string;
  date_of_birth: string;
  first_interview_date: string;
  last_name: string;
  first_name: string;
  last_name_kana: string;
  first_name_kana: string;
  gender: string;
  household: string;
  insurance_policy_end_date: string;
  insurance_policy_start_date: string;
  insurance_premium: number;
  insurance_type: string;
  number_of_visits: number;
  payment_method: string;
  postal_code: string;
  security_number: string;
  status: string;
  whole_life_insurance_flag: boolean;
  username: string;
  version: number;
  client_request_token: string;
}

export interface StmCreate {
  address: string;
  age: number;
  annual_income: number;
  annual_premium: number;
  annualized_premium_equivalent: number;
  application_date: string;
  contact_information: string;
  contract_completion_date: string;
  contract_type: string;
  date_of_birth: string;
  first_interview_date: string;
  last_name: string;
  first_name: string;
  last_name_kana: string;
  first_name_kana: string;
  gender: string;
  household: string;
  insurance_policy_end_date: string;
  insurance_policy_start_date: string;
  insurance_premium: number;
  insurance_type: string;
  number_of_visits: number;
  payment_method: string;
  postal_code: string;
  security_number: string;
  status: string;
  whole_life_insurance_flag: boolean;
}

export interface StmCreateWithToken extends StmCreate {
  client_request_token: string;
}

export interface StmUpdate {
  address: string;
  age: number;
  annual_income: number;
  annual_premium: number;
  annualized_premium_equivalent: number;
  application_date: string;
  contact_information: string;
  contract_completion_date: string;
  contract_type: string;
  date_of_birth: string;
  first_interview_date: string;
  last_name: string;
  first_name: string;
  last_name_kana: string;
  first_name_kana: string;
  gender: string;
  household: string;
  insurance_policy_end_date: string;
  insurance_policy_start_date: string;
  insurance_premium: number;
  insurance_type: string;
  number_of_visits: number;
  payment_method: string;
  postal_code: string;
  security_number: string;
  status: string;
  whole_life_insurance_flag: boolean;
}

export interface StmUpdateWithToken extends StmUpdate {
  client_request_token: string;
}

export interface StmDelete {
  version: number;
}

export interface StmDeleteWithToken extends StmDelete {
  client_request_token: string;
}
