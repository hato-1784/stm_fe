// 基本となるインターフェース
export interface StmBase {
  address: string;
  age: number;
  annual_income: number;
  annual_premium: number;
  annualized_premium_equivalent: number;
  application_date: string;
  contact_information: string;
  contract_completion_date: string;
  contract_type: string;
  date_of_birth: string | null; // null許容のため、Stm以外でもこの形式を採用
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

// ID, ユーザー名、バージョン、トークンを含むインターフェース
export interface Stm extends StmBase {
  id: string;
  username: string;
  version: number;
  client_request_token: string;
}

// StmDetailはStmと同じプロパティを持つ
export type StmDetail = Stm;

// 作成時にはID, ユーザー名、バージョン、トークンは不要
export type StmCreate = StmBase;

// トークンを含む作成インターフェース
export interface StmCreateWithToken extends StmCreate {
  client_request_token: string;
}

// 更新時にも基本的にはStmCreateと同じプロパティ
export type StmUpdate = StmCreate;

// トークンを含む更新インターフェース
export interface StmUpdateWithToken extends StmUpdate {
  client_request_token: string;
}

// 削除時にはバージョンとトークンのみ必要
export interface StmDelete {
  version: number;
}

export interface StmDeleteWithToken extends StmDelete {
  client_request_token: string;
}