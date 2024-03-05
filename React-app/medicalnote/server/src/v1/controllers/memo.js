const { deleteOne } = require("../models/memo");
const Memo = require("../models/memo")

exports.create = async (req, res) => {
  try {
    const memoCount = await Memo.find().count();
    // メモ新規作成
    const memo = await Memo.create({
      user: req.user._id,
      position: memoCount > 0 ? memoCount : 0,
    });
    res.status(201).json(memo);
  } catch {
    res.status(500).json(err)
  }
};


exports.getAll = async (req, res) => {
  try {
    const memos = await Memo.find({ user: req.user._id}).sort("-position");
    res.status(200).json(memos);
  } catch {
    res.status(500).json(err)
  }
};

exports.getOne = async (req, res) => {
  const { memoId } = req.params;
  try {
    const memo = await Memo.findOne({ user: req.user._id, _id: memoId })
    if (!memo) return res.status(404).json("メモが存在しません");
    res.status(200).json(memo);
  } catch (err) {
    res.status(500).json(err)
  }
}



exports.update = async (req, res) => {
  const { title, description, rating, favorite } = req.body;
  const { memoId } = req.params;
  try {

    if (title === "") req.body.title = new Date().toLocaleDateString("ja-JP",
      {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      })
    if (description === "") req.body.description = "ここに自由に記入してください";
    if (rating === 0) req.body.rating = 0;

    const currentMemo = await Memo.findById(memoId);
    if (!currentMemo) return res.status(404).json("メモが存在しません");

    //現在見ているメモがお気に入りがまだされていない時
    if (favorite !== undefined && currentMemo.favorite !== favorite) {
      //現在のメモ以外のお気に入りされているメモを探して配列で返す
      const favorites = await Memo.find({
        user: currentMemo.user,
        favorite: true,
        _id: { $ne: memoId },
      });

      if (favorite) {
        //自分以外のお気に入りされているメモの数を返す=それが今のメモの位置に設定される。
        req.body.favoritePosition = favorites.length > 0 ? favorites.length : 0;
      } else {
        for (const key in favorites) {
          const element = favorites[key];
          await Memo.findByIdAndUpdate(element.id, {
            $set: { favoritePosition: key },
          });
        }
      }
    }


    const memo = await Memo.findOne({ user: req.user._id, _id: memoId })
    if (!memo) return res.status(404).json("メモが存在しません");

    const updatedMemo = await Memo.findByIdAndUpdate(memoId, {
      $set: req.body,
    });

    res.status(200).json(updatedMemo);
  } catch (err) {
    res.status(500).json(err)
  }
}


exports.getFavorites = async (req, res) => {
  try {
    const favorites = await Memo.find({
      user: req.user._id,
      favorite: true,
    }).sort("-favoritePosition");

    res.status(200).json(favorites);
  } catch (err) {
    console.error("Error in getFavorites:", err);
    res.status(500).json(err);
  }
};



exports.delete = async (req, res) => {
  const { memoId } = req.params;
  try {
    const memo = await Memo.findOne({ user: req.user._id, _id: memoId })
    if (!memo) return res.status(404).json("メモが存在しません");

    await Memo.deleteOne({ _id: memoId });
    res.status(200).json("メモを消去しました");
  } catch (err) {
    res.status(500).json(err)
  }
}
