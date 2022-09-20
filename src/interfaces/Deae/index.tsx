export interface IDeae {
  id: string;
  created_at: string;
  adjustment: string;
  is_valid: boolean;
  classification: {
    id: string;
    label: string;
  };
  deviation: string;
  local: {
    id: string;
    label: string;
  };
  status: {
    id: string;
    label: string;
  };
  user: {
    id: string;
    username: string;
    email: string;
  }
}