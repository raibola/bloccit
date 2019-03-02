const ApplicationPolicy = require("./application");

module.exports = class PostPolicy extends ApplicationPolicy {

  new() {
    if (this._isAdmin() || this._isMember()) {
        return true;
    }
  }

  create() {
    return this.new();
  }

  edit() {
    if (this._isAdmin() || this._isOwner()) {
        return true;
    }
  }

  update() {
    return this.edit();
  }

  destroy() {
    if (this._isAdmin() || this._isOwner()) {
        return true;
    }
  }
}