import React, { useEffect, useState } from "react";
import withAuth from 'src/components/hoc/with_auth';
import { useRouter } from 'next/router';
import { User } from 'src/interfaces/user';
import { Stm, StmUpdate } from 'src/interfaces/stm'; // StmUpdateインタフェースをインポート
import stmApi from 'src/pages/api/stm';
import { Container, Typography, Grid, Paper, Divider, Box, CircularProgress, IconButton, Tooltip, TextField, MenuItem, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save'; // SaveIconをインポート
import CancelIcon from '@mui/icons-material/Cancel'; // CancelIconをインポート
import copy from 'copy-to-clipboard';
import { fetchAddressFromPostalCode } from 'src/utils/addressUtils';
import { calcAge } from 'src/utils/calcUtils';
import { PatternFormat, NumericFormat } from 'react-number-format';

interface CopyToClipboardButtonProps {
  text: string;
}

const CopyToClipboardButton = ({ text }: CopyToClipboardButtonProps) => {
  const [openTip, setOpenTip] = useState<boolean>(false);

  const handleCopy = () => {
    copy(text);
    setOpenTip(true);
    setTimeout(() => setOpenTip(false), 2000);
  };

  const handleCloseTip = () => {
    setOpenTip(false);
  };

  return (
    <Tooltip
      arrow
      open={openTip}
      onClose={handleCloseTip}
      disableHoverListener
      placement="top"
      title="コピーしました！"
    >
      <IconButton onClick={handleCopy} size="small">
        <FileCopyIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};

const DetailPage: React.FC<User> = ({ username }) => {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState<Stm | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editMode, setEditMode] = useState<string | null>(null); // 編集モードの状態を追加
  const [formData, setFormData] = useState<StmUpdate | null>(null); // フォームデータの状態を追加

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }
      try {
        console.log("useEffect");
        const res = await stmApi.stmDetail(id as string);
        setData(res);
        setFormData(res);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleEditClick = (section: string) => {
    setEditMode(section);
  };

  const handleSaveClick = async () => {
    console.log("handleSaveClick");
    if (id && formData) {
      try {
        await stmApi.stmUpdate(id as string, username as string, formData);
        const res = await stmApi.stmDetail(id as string);
        setData(res); // データを更新
        setFormData(res);
        setEditMode(null); // 編集モードを解除
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleCancelClick = () => {
    setEditMode(null); // 編集モードを解除
    setFormData(data); // フォームデータを元のデータにリセット
  };

  const handleChange = (field: keyof StmUpdate, value: any) => {
    setFormData((prev) => (prev ? { ...prev, [field]: value } : null));
  };

  // 郵便番号から住所を自動入力する関数
  const handlePostalCodeChange = async (postalCode: string) => {
    console.log("郵便番号：" + postalCode);
    setFormData((prev) => (prev ? { ...prev, postal_code: postalCode } : null));

    if (postalCode.length === 7) { // 日本の郵便番号は7桁
      const address = await fetchAddressFromPostalCode(postalCode);
      setFormData((prev) => (prev ? { ...prev, address: address } : null));
    }
  };

  const handleChangeDateOfBirth = (value: string) => {
    console.log("生年月日：" + value)
    if (value) {
      const age = calcAge(value);
      setFormData((prev) => (prev ? { ...prev, date_of_birth: value, age: age } : null));
    } else {
      // 生年月日が空白の場合、date_of_birthをnullとして設定
      setFormData((prev) => (prev ? { ...prev, date_of_birth: null } : null));
    }
  };

  if (isLoading) {
    return (
      <Container component="main">
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
          }}
        >
          <CircularProgress /> {/* ローディングインジケーターを表示 */}
        </Box>
      </Container>
    );
  }

  if (!data) {
    return;
  }

  return (
    <Container maxWidth="lg" style={{ padding: '24px' }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box display="flex" flexDirection="column" height="100%">
            <Paper style={{ padding: '20px', flexGrow: 1, overflow: 'hidden' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" gutterBottom>個人情報</Typography>
                {editMode === 'personal' ? (
                  <Box>
                    <IconButton onClick={handleSaveClick} size="small">
                      <SaveIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={handleCancelClick} size="small">
                      <CancelIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ) : (
                  <IconButton onClick={() => handleEditClick('personal')} size="small">
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
              <Divider />
              <Grid container spacing={2} alignItems="stretch" style={{ marginTop: '10px' }}>
                {editMode === 'personal' ? (
                  <>
                    {/* 個人情報 */}
                    <Grid item xs={3} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Typography>氏名：</Typography>
                    </Grid>
                    <Grid item xs={9} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Box display="flex" gap={2}>
                        <TextField
                          fullWidth
                          size="small"
                          label="姓"
                          variant="outlined"
                          value={formData?.last_name || ''}
                          onChange={(e) => handleChange('last_name', e.target.value)}
                        />
                        <TextField
                          fullWidth
                          size="small"
                          label="名"
                          variant="outlined"
                          value={formData?.first_name || ''}
                          onChange={(e) => handleChange('first_name', e.target.value)}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={3} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Typography>フリガナ：</Typography>
                    </Grid>
                    <Grid item xs={9} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Box display="flex" gap={2}>
                        <TextField
                          fullWidth
                          size="small"
                          label="セイ"
                          variant="outlined"
                          value={formData?.last_name_kana || ''}
                          onChange={(e) => handleChange('last_name_kana', e.target.value)}
                        />
                        <TextField
                          fullWidth
                          size="small"
                          label="メイ"
                          variant="outlined"
                          value={formData?.first_name_kana || ''}
                          onChange={(e) => handleChange('first_name_kana', e.target.value)}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={3} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Typography>年齢：</Typography>
                    </Grid>
                    <Grid item xs={9} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Box display="flex" gap={2}>
                        <TextField
                          fullWidth
                          size="small"
                          label="年齢"
                          variant="outlined"
                          value={formData?.age || ''}
                          onChange={(e) => handleChange('age', e.target.value)}
                        />
                        <PatternFormat
                          customInput={TextField}
                          format="####/##/##"
                          placeholder="年/月/日"
                          mask=" "
                          value={formData?.date_of_birth || ''}
                          onValueChange={(values) => {
                            // const { formattedValue } = values;
                            // handleChangeDateOfBirth(values.value);
                            handleChangeDateOfBirth(values.formattedValue);
                          }}
                          fullWidth
                          size="small"
                          label="生年月日"
                          variant="outlined"
                          InputLabelProps={{
                            shrink: true,
                          }}
                          InputProps={{
                            style: { letterSpacing: '2px' } // テキストの間隔を調整
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={3} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Typography>性別：</Typography>
                    </Grid>
                    <Grid item xs={9} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}> {/* minHeightを設定 */}
                      <FormControl>
                        <FormLabel id="gender-radio-buttons-group">性別</FormLabel>
                        <RadioGroup
                          row
                          aria-labelledby="gender-radio-buttons-group"
                          name="gender-radio-buttons-group"
                          value={formData?.gender || ''}
                          onChange={(e) => handleChange('gender', e.target.value)}
                        >
                          <FormControlLabel value="男性" control={<Radio size="small" />} label="男性" />
                          <FormControlLabel value="女性" control={<Radio size="small" />} label="女性" />
                          <FormControlLabel value="その他" control={<Radio size="small" />} label="その他" />
                        </RadioGroup>
                      </FormControl>
                      {/* <TextField
                        select
                        fullWidth
                        size="small"
                        label="性別"
                        variant="outlined"
                        value={formData?.gender || ''}
                        onChange={(e) => handleChange('gender', e.target.value)}
                      >
                        <MenuItem value="男">男性</MenuItem>
                        <MenuItem value="女">女性</MenuItem>
                        <MenuItem value="other">その他</MenuItem>
                      </TextField> */}
                    </Grid>
                  </>
                ) : (
                  <>
                    {/* 個人情報 */}
                    <Grid item xs={3} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Typography>氏名：</Typography>
                    </Grid>
                    <Grid item xs={8} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Typography>{data.last_name} {data.first_name}（{data.last_name_kana} {data.first_name_kana}）</Typography>
                    </Grid>
                    <Grid item xs={1} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', minHeight: '64px' }}>
                      <CopyToClipboardButton text={`${data.first_name} ${data.last_name}`} />
                    </Grid>
                    <Grid item xs={3} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Typography>年齢：</Typography>
                    </Grid>
                    <Grid item xs={8} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Typography>{data.age}歳（{data.date_of_birth}生まれ）</Typography>
                    </Grid>
                    <Grid item xs={1} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', minHeight: '64px' }}>
                      <CopyToClipboardButton text={`${data.age}歳（${data.date_of_birth}生まれ）`} />
                    </Grid>
                    <Grid item xs={3} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Typography>性別：</Typography>
                    </Grid>
                    <Grid item xs={8} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Typography>{data.gender}</Typography>
                    </Grid>
                    <Grid item xs={1} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', minHeight: '64px' }}>
                      <CopyToClipboardButton text={data.gender} />
                    </Grid>
                  </>
                )}
              </Grid>
            </Paper>
          </Box>
        </Grid>

        {/* 連絡先情報 */}
        <Grid item xs={12} md={6}>
          <Box display="flex" flexDirection="column" height="100%">
            <Paper style={{ padding: '20px', flexGrow: 1, overflow: 'hidden' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" gutterBottom>連絡先情報</Typography>
                {editMode === 'contact' ? (
                  <Box>
                    <IconButton onClick={handleSaveClick} size="small">
                      <SaveIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={handleCancelClick} size="small">
                      <CancelIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ) : (
                  <IconButton onClick={() => handleEditClick('contact')} size="small">
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
              <Divider />
              <Grid container spacing={2} style={{ marginTop: '10px', alignItems: 'center' }}>
                {editMode === 'contact' ? (
                  <>
                    <Grid item xs={3} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Typography>郵便番号：</Typography>
                    </Grid>
                    <Grid item xs={9} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <PatternFormat
                        customInput={TextField}
                        format="### - ####"
                        mask=" "
                        fullWidth
                        size="small"
                        label="郵便番号"
                        variant="outlined"
                        value={formData?.postal_code || ''}
                        onValueChange={(values) => handlePostalCodeChange(values.value)}
                      />
                    </Grid>
                    <Grid item xs={3} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Typography>住所：</Typography>
                    </Grid>
                    <Grid item xs={9} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="住所"
                        variant="outlined"
                        value={formData?.address || ''}
                        onChange={(e) => handleChange('address', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={3} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Typography>連絡先：</Typography>
                    </Grid>
                    <Grid item xs={9} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="連絡先"
                        variant="outlined"
                        value={formData?.contact_information || ''}
                        onChange={(e) => handleChange('contact_information', e.target.value)}
                      />
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item xs={3} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Typography>郵便番号：</Typography>
                    </Grid>
                    <Grid item xs={8} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Typography>{data.postal_code}</Typography>
                    </Grid>
                    <Grid item xs={1} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', minHeight: '64px' }}>
                      <CopyToClipboardButton text={data.postal_code} />
                    </Grid>
                    <Grid item xs={3} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Typography>住所：</Typography>
                    </Grid>
                    <Grid item xs={8} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Typography>{data.address}</Typography>
                    </Grid>
                    <Grid item xs={1} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', minHeight: '64px' }}>
                      <CopyToClipboardButton text={data.address} />
                    </Grid>
                    <Grid item xs={3} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Typography>連絡先：</Typography>
                    </Grid>
                    <Grid item xs={8} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Typography>{data.contact_information}</Typography>
                    </Grid>
                    <Grid item xs={1} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', minHeight: '64px' }}>
                      <CopyToClipboardButton text={data.contact_information} />
                    </Grid>
                  </>
                )}
              </Grid>
            </Paper>
          </Box>
        </Grid>

        {/* 契約情報 */}
        <Grid item xs={12} md={6}>
          <Box display="flex" flexDirection="column" height="100%">
            <Paper style={{ padding: '20px', flexGrow: 1, overflow: 'hidden' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" gutterBottom>契約情報</Typography>
                {editMode === 'contract' ? (
                  <Box>
                    <IconButton onClick={handleSaveClick} size="small">
                      <SaveIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={handleCancelClick} size="small">
                      <CancelIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ) : (
                  <IconButton onClick={() => handleEditClick('contract')} size="small">
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
              <Divider />
              <Grid container spacing={2} style={{ marginTop: '10px', alignItems: 'center' }}>
                {editMode === 'contract' ? (
                  <>
                    <Grid item xs={3} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Typography>申込日：</Typography>
                    </Grid>
                    <Grid item xs={9} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="申込日"
                        variant="outlined"
                        value={formData?.application_date || ''}
                        onChange={(e) => handleChange('application_date', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={3} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Typography>保険種別：</Typography>
                    </Grid>
                    <Grid item xs={9} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="保険種別"
                        variant="outlined"
                        value={formData?.insurance_type || ''}
                        onChange={(e) => handleChange('insurance_type', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={3} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Typography>証券番号：</Typography>
                    </Grid>
                    <Grid item xs={9} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="証券番号"
                        variant="outlined"
                        value={formData?.security_number || ''}
                        onChange={(e) => handleChange('security_number', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={3} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Typography>保険期間：</Typography>
                    </Grid>
                    <Grid item xs={9} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Box display="flex" gap={2}>
                        <TextField
                          fullWidth
                          size="small"
                          label="保険開始日"
                          variant="outlined"
                          value={formData?.insurance_policy_start_date || ''}
                          onChange={(e) => handleChange('insurance_policy_start_date', e.target.value)}
                        />
                        <TextField
                          fullWidth
                          size="small"
                          label="保険終了日"
                          variant="outlined"
                          value={formData?.insurance_policy_end_date || ''}
                          onChange={(e) => handleChange('insurance_policy_end_date', e.target.value)}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={3} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Typography>保険料：</Typography>
                    </Grid>
                    <Grid item xs={9} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Box display="flex" gap={2}>
                        <TextField
                          fullWidth
                          size="small"
                          label="保険料"
                          variant="outlined"
                          value={formData?.insurance_premium || ''}
                          onChange={(e) => handleChange('insurance_premium', e.target.value)}
                        />
                        <TextField
                          fullWidth
                          size="small"
                          label="支払方法"
                          variant="outlined"
                          value={formData?.payment_method || ''}
                          onChange={(e) => handleChange('payment_method', e.target.value)}
                        />
                      </Box>
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item xs={3} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Typography>申込日：</Typography>
                    </Grid>
                    <Grid item xs={8} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Typography>{data.application_date}</Typography>
                    </Grid>
                    <Grid item xs={1} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', minHeight: '64px' }}>
                      <CopyToClipboardButton text={data.address} />
                    </Grid>
                    <Grid item xs={3} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Typography>保険種別：</Typography>
                    </Grid>
                    <Grid item xs={8} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Typography>{data.insurance_type}</Typography>
                    </Grid>
                    <Grid item xs={1} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', minHeight: '64px' }}>
                      <CopyToClipboardButton text={data.insurance_type} />
                    </Grid>
                    <Grid item xs={3} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Typography>証券番号：</Typography>
                    </Grid>
                    <Grid item xs={8} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Typography>{data.security_number}</Typography>
                    </Grid>
                    <Grid item xs={1} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', minHeight: '64px' }}>
                      <CopyToClipboardButton text={data.security_number} />
                    </Grid>
                    <Grid item xs={3} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Typography>保険期間：</Typography>
                    </Grid>
                    <Grid item xs={8} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Typography>{data.insurance_policy_start_date} ～ {data.insurance_policy_end_date}</Typography>
                    </Grid>
                    <Grid item xs={1} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', minHeight: '64px' }}>
                      <CopyToClipboardButton text={data.insurance_policy_start_date} />
                    </Grid>
                    <Grid item xs={3} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Typography>保険料：</Typography>
                    </Grid>
                    <Grid item xs={8} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Typography>{data.insurance_premium}円（{data.payment_method}）</Typography>
                    </Grid>
                    <Grid item xs={1} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', minHeight: '64px' }}>
                      <CopyToClipboardButton text={data.insurance_policy_start_date} />
                    </Grid>
                  </>
                )}
              </Grid>
            </Paper>
          </Box>
        </Grid>

        {/* 営業情報 */}
        <Grid item xs={12} md={6}>
          <Box display="flex" flexDirection="column" height="100%">
            <Paper style={{ padding: '20px', flexGrow: 1, overflow: 'hidden' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" gutterBottom>営業情報</Typography>
                {editMode === 'sales' ? (
                  <Box>
                    <IconButton onClick={handleSaveClick} size="small">
                      <SaveIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={handleCancelClick} size="small">
                      <CancelIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ) : (
                  <IconButton onClick={() => handleEditClick('sales')} size="small">
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
              <Divider />
              <Grid container spacing={2} style={{ marginTop: '10px', alignItems: 'center' }}>
                {editMode === 'sales' ? (
                  <>
                    <Grid item xs={3} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Typography>初回面談日：</Typography>
                    </Grid>
                    <Grid item xs={9} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="初回面談日"
                        variant="outlined"
                        value={formData?.first_interview_date || ''}
                        onChange={(e) => handleChange('first_interview_date', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={3} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Typography>AP：</Typography>
                    </Grid>
                    <Grid item xs={9} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="AP"
                        variant="outlined"
                        value={formData?.annual_premium || ''}
                        onChange={(e) => handleChange('annual_premium', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={3} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Typography>AC：</Typography>
                    </Grid>
                    <Grid item xs={9} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="AC"
                        variant="outlined"
                        value={formData?.annualized_premium_equivalent || ''}
                        onChange={(e) => handleChange('annualized_premium_equivalent', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={3} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Typography>訪問回数：</Typography>
                    </Grid>
                    <Grid item xs={9} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="訪問回数"
                        variant="outlined"
                        value={formData?.number_of_visits || ''}
                        onChange={(e) => handleChange('number_of_visits', e.target.value)}
                      />
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item xs={3} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Typography>初回面談日：</Typography>
                    </Grid>
                    <Grid item xs={8} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Typography>{data.first_interview_date}</Typography>
                    </Grid>
                    <Grid item xs={1} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', minHeight: '64px' }}>
                      <CopyToClipboardButton text={data.first_interview_date} />
                    </Grid>
                    <Grid item xs={3} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Typography>AP：</Typography>
                    </Grid>
                    <Grid item xs={8} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Typography>{data.annual_premium}円</Typography>
                    </Grid>
                    <Grid item xs={1} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', minHeight: '64px' }}>
                      <CopyToClipboardButton text={`${data.annual_premium}`} />
                    </Grid>
                    <Grid item xs={3} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Typography>AC：</Typography>
                    </Grid>
                    <Grid item xs={8} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Typography>{data.annualized_premium_equivalent}円</Typography>
                    </Grid>
                    <Grid item xs={1} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', minHeight: '64px' }}>
                      <CopyToClipboardButton text={`${data.annualized_premium_equivalent}`} />
                    </Grid>
                    <Grid item xs={3} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Typography>訪問回数：</Typography>
                    </Grid>
                    <Grid item xs={8} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Typography>{data.number_of_visits}回</Typography>
                    </Grid>
                    <Grid item xs={1} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', minHeight: '64px' }}>
                      <CopyToClipboardButton text={`${data.number_of_visits}`} />
                    </Grid>
                  </>
                )}
              </Grid>
            </Paper>
          </Box>
        </Grid>

        {/* 営業情報 */}
        <Grid item xs={12} md={6}>
          <Box display="flex" flexDirection="column" height="100%">
            <Paper style={{ padding: '20px', flexGrow: 1, overflow: 'hidden' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" gutterBottom>その他</Typography>
                {editMode === 'other' ? (
                  <Box>
                    <IconButton onClick={handleSaveClick} size="small">
                      <SaveIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={handleCancelClick} size="small">
                      <CancelIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ) : (
                  <IconButton onClick={() => handleEditClick('other')} size="small">
                    <EditIcon fontSize="small" />
                  </IconButton>
                )}
              </Box>
              <Divider />
              <Grid container spacing={2} style={{ marginTop: '10px', alignItems: 'center' }}>
                {editMode === 'other' ? (
                  <>
                    <Grid item xs={3} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Typography>年収：</Typography>
                    </Grid>
                    <Grid item xs={9} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="年収"
                        variant="outlined"
                        value={formData?.annual_income || ''}
                        onChange={(e) => handleChange('annual_income', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={3} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Typography>世帯：</Typography>
                    </Grid>
                    <Grid item xs={9} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <TextField
                        fullWidth
                        size="small"
                        label="世帯"
                        variant="outlined"
                        value={formData?.household || ''}
                        onChange={(e) => handleChange('household', e.target.value)}
                      />
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item xs={3} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Typography>年収：</Typography>
                    </Grid>
                    <Grid item xs={8} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Typography>{data.annual_income}万</Typography>
                    </Grid>
                    <Grid item xs={1} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', minHeight: '64px' }}>
                      <CopyToClipboardButton text={`${data.annual_income}`} />
                    </Grid>
                    <Grid item xs={3} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Typography>世帯：</Typography>
                    </Grid>
                    <Grid item xs={8} style={{ display: 'flex', alignItems: 'center', minHeight: '64px' }}>
                      <Typography>{data.household}</Typography>
                    </Grid>
                    <Grid item xs={1} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', minHeight: '64px' }}>
                      <CopyToClipboardButton text={`${data.household}`} />
                    </Grid>
                  </>
                )}
              </Grid>
            </Paper>
          </Box>
        </Grid>
      </Grid >
    </Container >
  );
};

export default withAuth(DetailPage);
