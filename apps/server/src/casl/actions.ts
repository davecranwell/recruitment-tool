export enum Action {
  Manage = 'manage', // can do everything
  Approve = 'approve', // not quite manage privs, but higher sec than regular update
  Delete = 'delete',
  Update = 'update', // can update bu still can't delete
  Create = 'create',
  Review = 'review', // like reading, but with even more privilege
  Read = 'read',
}
