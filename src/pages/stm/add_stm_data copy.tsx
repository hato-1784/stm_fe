import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from 'src/contexts/auth';
import { StmCreate } from 'src/interfaces/stm';
import { stmCreate } from 'src/pages/api/stm';
import { Button, TextField, Container, Box } from '@mui/material';

const CreateStmPage = () => {
  const username = useAuth().user?.username;
  const [formData, setFormData] = useState<StmCreate>({
    // 初期値を設定
    address: '',
    age: 0,
    annual_income: 0,
    annual_premium: 0,
    annualized_premium_equivalent: 0,
    application_date: '',
    contact_information: '',
    contract_completion_date: '',
    contract_type: '',
    date_of_birth: '',
    first_interview_date: '',
    last_name: '',
    first_name: '',
    last_name_kana: '',
    first_name_kana: '',
    gender: '',
    household: '',
    insurance_policy_end_date: '',
    insurance_policy_start_date: '',
    insurance_premium: 0,
    insurance_type: '',
    number_of_visits: 0,
    payment_method: '',
    postal_code: '',
    security_number: '',
    status: '',
    whole_life_insurance_flag: false,
  });
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await stmCreate(username as string, formData);
      router.push('/stm'); // 成功したらSTMのリストページにリダイレクト
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container maxWidth="lg" style={{ padding: '24px' }}>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <TextField
          margin="normal"
          required
          fullWidth
          id="last_name"
          label="姓"
          name="last_name"
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="first_name"
          label="名"
          name="first_name"
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="last_name_kana"
          label="セイ"
          name="last_name_kana"
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="first_name_kana"
          label="メイ"
          name="first_name_kana"
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="age"
          label="年齢"
          name="age"
          type="number"
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="gender"
          label="性別"
          name="gender"
          select
          SelectProps={{ native: true }}
          onChange={handleChange}
        >
          <option value=""></option>
          <option value="male">男性</option>
          <option value="female">女性</option>
          <option value="other">その他</option>
        </TextField>
        <TextField
          margin="normal"
          required
          fullWidth
          id="date_of_birth"
          label="生年月日"
          name="date_of_birth"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="contact_information"
          label="連絡先"
          name="contact_information"
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="postal_code"
          label="郵便番号"
          name="postal_code"
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="address"
          label="住所"
          name="address"
          autoComplete="address"
          autoFocus
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="annual_income"
          label="年収"
          name="annual_income"
          type="number"
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="annual_premium"
          label="年間保険料"
          name="annual_premium"
          type="number"
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="annualized_premium_equivalent"
          label="年間保険料換算額"
          name="annualized_premium_equivalent"
          type="number"
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="application_date"
          label="申込日"
          name="application_date"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="contract_completion_date"
          label="契約完了日"
          name="contract_completion_date"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="contract_type"
          label="契約タイプ"
          name="contract_type"
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="first_interview_date"
          label="初回面談日"
          name="first_interview_date"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="insurance_policy_end_date"
          label="保険契約終了日"
          name="insurance_policy_end_date"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="insurance_policy_start_date"
          label="保険契約開始日"
          name="insurance_policy_start_date"
          type="date"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="insurance_premium"
          label="保険料"
          name="insurance_premium"
          type="number"
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="insurance_type"
          label="保険の種類"
          name="insurance_type"
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="number_of_visits"
          label="訪問回数"
          name="number_of_visits"
          type="number"
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="payment_method"
          label="支払方法"
          name="payment_method"
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="security_number"
          label="セキュリティ番号"
          name="security_number"
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="status"
          label="ステータス"
          name="status"
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="whole_life_insurance_flag"
          label="終身保険フラグ"
          name="whole_life_insurance_flag"
          select
          SelectProps={{ native: true }}
          onChange={handleChange}
        >
          <option value=""></option>
          <option value="true">はい</option>
          <option value="false">いいえ</option>
        </TextField>
        <TextField
          margin="normal"
          required
          fullWidth
          id="household"
          label="世帯"
          name="household"
          onChange={handleChange}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          送信
        </Button>
      </Box>
    </Container>
  );
};

export default CreateStmPage;