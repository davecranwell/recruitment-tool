export enum Action {
  Manage = 'manage', // can do everything
  Create = 'create',
  Review = 'review', // like reading, but with even more privilege
  Read = 'read',
  Update = 'update', // can't delete
  Delete = 'delete',
}
