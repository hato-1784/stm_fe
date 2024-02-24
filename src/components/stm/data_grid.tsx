import React, { createContext, useContext, useMemo } from 'react';
import { DataGrid, useGridApiContext, DataGridProps, GridApiCommon } from '@mui/x-data-grid';

// API参照を共有するためのContextを作成
const GridApiContext = createContext<{ apiRef: React.MutableRefObject<GridApiCommon> | null }>({ apiRef: null });

// ContextからAPIを取得するためのカスタムフック
export const useGridApi = () => useContext(GridApiContext);

const MyDataGrid = (props: DataGridProps) => {
  const apiRef = useGridApiContext();

  // API参照をContextに渡す
  const contextValue = useMemo(() => ({ apiRef }), [apiRef]);

  return (
    <GridApiContext.Provider value={contextValue}>
      <DataGrid {...props} />
    </GridApiContext.Provider>
  );
};

export default MyDataGrid;