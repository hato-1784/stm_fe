import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { Stm } from 'src/interfaces/stm';
import { stmDetail } from 'src/pages/api/stm';
import { Container, Typography, Grid, Paper, Divider, Box, CircularProgress, IconButton, Tooltip } from '@mui/material';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import EditIcon from '@mui/icons-material/Edit'; // EditIconをインポート
import copy from 'copy-to-clipboard';

interface CopyToClipboardButtonProps {
  text: string;
}

const CopyToClipboardButton = ({ text }: CopyToClipboardButtonProps) => {
  const [openTip, setOpenTip] = useState<boolean>(false);

  const handleCopy = () => {
    copy(text);
    setOpenTip(true); // コピー後にツールチップを表示
    setTimeout(() => setOpenTip(false), 2000); // 2秒後にツールチップを非表示
  };

  const handleCloseTip = () => {
    setOpenTip(false); // ツールチップを閉じる
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

// CopyToClipboardButtonコンポーネントの下に新しいコンポーネントを追加
interface EditButtonProps {
  onClick: () => void; // クリック時のイベントハンドラーをPropsとして受け取る
}

const EditButton = ({ onClick }: EditButtonProps) => {
  return (
    <IconButton onClick={onClick} size="small">
      <EditIcon fontSize="small" />
    </IconButton>
  );
};

const DetailPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [data, setData] = useState<Stm | null>(null);
  const [isLoading, setIsLoading] = useState(true); // データ読み込み状態を追跡するための状態変数

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await stmDetail(id as string);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false); // データ読み込み完了またはエラー発生時にローディング状態を解除
      }
    };
    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <Container maxWidth="lg" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress /> {/* ローディングインジケーターを表示 */}
      </Container>
    );
  }

  if (!data) {
    return <Container maxWidth="lg">データが見つかりません。</Container>;
  }

  return (
    <Container maxWidth="lg" style={{ padding: '24px' }}>
      <Grid container spacing={3}>
        {/* 個人情報と連絡情報 */}
        <Grid item xs={12} md={6}>
          <Box display="flex" flexDirection="column" height="100%">
            <Paper style={{ padding: '20px', flexGrow: 1 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" gutterBottom>個人情報</Typography>
                <EditButton onClick={() => {/* ここに編集機能を実装 */ }} />
              </Box>
              <Divider />
              <Grid container spacing={2} style={{ marginTop: '10px', alignItems: 'center' }}> {/* alignItemsを追加してアイコンを中央に配置 */}
                <Grid item xs={2}><Typography>氏名：</Typography></Grid>
                <Grid item xs={8}>
                  <Typography>{data.first_name} {data.last_name}（{data.first_name_kana} {data.last_name_kana}）</Typography>
                </Grid>
                <Grid item xs={2} style={{ textAlign: 'right' }}> {/* xsの値を2に変更し、textAlignを追加してアイコンを右寄せに */}
                  <CopyToClipboardButton text={`${data.first_name} ${data.last_name}（${data.first_name_kana} ${data.last_name_kana}）`} />
                </Grid>
                <Grid item xs={2}><Typography>年齢：</Typography></Grid>
                <Grid item xs={8}>
                  <Typography>{data.age}歳（{data.date_of_birth}生まれ）</Typography>
                </Grid>
                <Grid item xs={2} style={{ textAlign: 'right' }}>
                  <CopyToClipboardButton text={`${data.age}歳（${data.date_of_birth}生まれ）`} />
                </Grid>
                <Grid item xs={2}><Typography>性別：</Typography></Grid>
                <Grid item xs={8}>
                  <Typography>{data.gender}</Typography>
                </Grid>
                <Grid item xs={2} style={{ textAlign: 'right' }}>
                  <CopyToClipboardButton text={data.gender} />
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </Grid>

        {/* 連絡情報 */}
        <Grid item xs={12} md={6}>
          <Box display="flex" flexDirection="column" height="100%">
            <Paper style={{ padding: '20px', flexGrow: 1 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" gutterBottom>連絡情報</Typography>
                <EditButton onClick={() => {/* ここに編集機能を実装 */ }} />
              </Box>
              <Divider />
              <Grid container spacing={2} style={{ marginTop: '10px', alignItems: 'center' }}>
                <Grid item xs={2}><Typography>住所：</Typography></Grid>
                <Grid item xs={8}>
                  <Typography>{data.address}</Typography>
                </Grid>
                <Grid item xs={2} style={{ textAlign: 'right' }}>
                  <CopyToClipboardButton text={data.address} />
                </Grid>
                <Grid item xs={2}><Typography>連絡先：</Typography></Grid>
                <Grid item xs={8}>
                  <Typography>{data.contact_information}</Typography>
                </Grid>
                <Grid item xs={2} style={{ textAlign: 'right' }}>
                  <CopyToClipboardButton text={data.contact_information} />
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </Grid>

        {/* 契約情報 */}
        <Grid item xs={12} md={6}>
          <Box display="flex" flexDirection="column" height="100%">
            <Paper style={{ padding: '20px', flexGrow: 1 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" gutterBottom>契約情報</Typography>
                <EditButton onClick={() => {/* ここに編集機能を実装 */ }} />
              </Box>
              <Divider />
              <Grid container spacing={2} style={{ marginTop: '10px', alignItems: 'center' }}>
                <Grid item xs={3}><Typography>申込日：</Typography></Grid>
                <Grid item xs={7}>
                  <Typography>{data.application_date}</Typography>
                </Grid>
                <Grid item xs={2} style={{ textAlign: 'right' }}>
                  <CopyToClipboardButton text={data.application_date} />
                </Grid>
                <Grid item xs={3}><Typography>保険種別：</Typography></Grid>
                <Grid item xs={7}>
                  <Typography>{data.insurance_type}</Typography>
                </Grid>
                <Grid item xs={2} style={{ textAlign: 'right' }}>
                  <CopyToClipboardButton text={data.insurance_type} />
                </Grid>
                <Grid item xs={3}><Typography>証券番号：</Typography></Grid>
                <Grid item xs={7}>
                  <Typography>{data.security_number}</Typography>
                </Grid>
                <Grid item xs={2} style={{ textAlign: 'right' }}>
                  <CopyToClipboardButton text={data.security_number} />
                </Grid>
                <Grid item xs={3}><Typography>保険期間：</Typography></Grid>
                <Grid item xs={7}>
                  <Typography>{data.insurance_policy_start_date} ～ {data.insurance_policy_end_date}</Typography>
                </Grid>
                <Grid item xs={2} style={{ textAlign: 'right' }}>
                  <CopyToClipboardButton text={`${data.insurance_policy_start_date} ～ ${data.insurance_policy_end_date}`} />
                </Grid>
                <Grid item xs={3}><Typography>保険料：</Typography></Grid>
                <Grid item xs={7}>
                  <Typography>{data.insurance_premium}円（{data.payment_method}）</Typography>
                </Grid>
                <Grid item xs={2} style={{ textAlign: 'right' }}>
                  <CopyToClipboardButton text={`${data.insurance_premium}円（${data.payment_method}）`} />
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </Grid>

        {/* 営業情報 */}
        <Grid item xs={12} md={6}>
          <Box display="flex" flexDirection="column" height="100%">
            <Paper style={{ padding: '20px', flexGrow: 1 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" gutterBottom>営業情報</Typography>
                <EditButton onClick={() => {/* ここに編集機能を実装 */ }} />
              </Box>
              <Divider />
              <Grid container spacing={2} style={{ marginTop: '10px', alignItems: 'center' }}>
                <Grid item xs={3}><Typography>初回面談日：</Typography></Grid>
                <Grid item xs={7}>
                  <Typography>{data.first_interview_date}</Typography>
                </Grid>
                <Grid item xs={2} style={{ textAlign: 'right' }}>
                  <CopyToClipboardButton text={data.first_interview_date} />
                </Grid>
                <Grid item xs={3}><Typography>AP：</Typography></Grid>
                <Grid item xs={7}>
                  <Typography>{data.annual_premium}円</Typography>
                </Grid>
                <Grid item xs={2} style={{ textAlign: 'right' }}>
                  <CopyToClipboardButton text={`${data.annual_premium}円`} />
                </Grid>
                <Grid item xs={3}><Typography>AC：</Typography></Grid>
                <Grid item xs={7}>
                  <Typography>{data.annualized_premium_equivalent}円</Typography>
                </Grid>
                <Grid item xs={2} style={{ textAlign: 'right' }}>
                  <CopyToClipboardButton text={`${data.annualized_premium_equivalent}円`} />
                </Grid>
                <Grid item xs={3}><Typography>訪問回数：</Typography></Grid>
                <Grid item xs={7}>
                  <Typography>{data.number_of_visits}回</Typography>
                </Grid>
                <Grid item xs={2} style={{ textAlign: 'right' }}>
                  <CopyToClipboardButton text={`${data.number_of_visits}回`} />
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </Grid>

        {/* その他 */}
        <Grid item xs={12} md={6}>
          <Box display="flex" flexDirection="column" height="100%">
            <Paper style={{ padding: '20px', flexGrow: 1 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h4" gutterBottom>その他</Typography>
                <EditButton onClick={() => {/* ここに編集機能を実装 */ }} />
              </Box>
              <Divider />
              <Grid container spacing={2} style={{ marginTop: '10px', alignItems: 'center' }}>
                <Grid item xs={2}><Typography>年収：</Typography></Grid>
                <Grid item xs={8}>
                  <Typography>{data.annual_income}万</Typography>
                </Grid>
                <Grid item xs={2} style={{ textAlign: 'right' }}>
                  <CopyToClipboardButton text={`${data.annual_income}万`} />
                </Grid>
                <Grid item xs={2}><Typography>世帯：</Typography></Grid>
                <Grid item xs={8}>
                  <Typography>{data.household}</Typography>
                </Grid>
                <Grid item xs={2} style={{ textAlign: 'right' }}>
                  <CopyToClipboardButton text={data.household} />
                </Grid>
              </Grid>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DetailPage;
