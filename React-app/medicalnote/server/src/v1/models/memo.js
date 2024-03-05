// ドキュメント参照
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// ログインしているユーザーとの連携（使える）
const memoSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  icon: {
    type: String,
    default: "📝"
  },
  title: {
    type: String,
    default: new Date().toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }),
  },
  description:{
    type: String,
    default: "ここに自由に記入してください"
  },
  position:{
    type: Number,
  },
  favorite: {
    type: Boolean,
    default: false,
  },

  favoritePosition: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
  }
});


module.exports = mongoose.model("Memo", memoSchema);
