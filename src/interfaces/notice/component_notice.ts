export interface Notice {
  title: string;
  message: string;
}

export interface NoticeDrawerProps {
  // ドロワーが開いているかどうかを判定するフラグ
  isOpen: boolean;
  // ドロワーを開くか閉じるかを判定する関数
  toggleDrawer: (isOpen: boolean) => void;
  // 通知のリスト
  notice: Notice[];
  // ドロップダウンが開いている通知のindex
  openDropdown: number | null;
  //ドロップダウンがクリックされたときに呼び出される関数
  handleDropdownClick: (index: number) => void;
}

export interface AccountMenuProps {
  anchorEl: null | HTMLElement;
  isMenuOpen: boolean;
  handleMenuClose: () => void;
  handleSignOut: () => void;
}

export interface PageNavigationProps {
  pages: string[];
  navigateToPage: (page: string) => void;
}
