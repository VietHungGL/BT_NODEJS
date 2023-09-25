const { fuzzySearch } = require("../../helper");
const Category = require("../../models/category");

const getAll = async (req, res, next) => {
  try {
    const payload = await Category.find({ isDeleted: false });

    res.send(200, {
      payload,
      message: "Lay DS Thành công",
    });
  } catch (error) {
    res.send(400, {
      message: " Lay DS Thất bại",
      errors: error,
    });
  }
};

//Hàm  tạo
const postCreate = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const newCategory = new Category({
      name,
      description,
    });

    const payload = await newCategory.save();

    res.send(200, {
      payload,
      message: "Tao Thành công",
    });
  } catch (error) {
    res.send(400, {
      message: "Tao Thất bại",
      errors: error,
    });
  }
};

const getSearch = async (req, res, next) => {
  try {
    const { name } = req.query;
    const conditionFind = { isDeleted: false };

    if (name) {
      conditionFind.name = fuzzySearch(name);
    }

    const payload = await Category.find({ isDeleted: false });

    res.send(200, {
      payload,
      message: "Tim Kiem Thành công",
    });
  } catch (error) {
    res.send(400, {
      message: " Tim Kiem Thất bại",
      errors: error,
    });
  }
};

const getDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = await Category.findOne({
      _id: id,
      isDeleted: false,
    });

    if (!payload) {
      return res.send(400, {
        message: "Không tìm thấy",
      });
    }

    return res.send(200, {
      payload,
      message: "Xem chi tiết thành công",
    });
  } catch (error) {
    res.send(400, {
      error,
      message: "Xem chi tiết không thành công",
    });
  }
};

const update = async (req, res, next) => {
  const { id } = req.params;
  // const { name, description, isDeleted } = req.body;

  try {
    const payload = await Category.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { ...req.body },
      { new: true }
    );

    if (payload) {
      return res.send(200, {
        message: "Cập nhật thành công",
        payload,
      });
    }

    return res.send(400, {
      message: "Thất bại",
    });
  } catch (err) {
    return res.send(400, {
      message: "Thất bại",
      errors: err,
    });
  }
};

const deteFun = async (req, res, next) => {
  try {
    const { id } = req.params;

    const payload = await Category.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (payload) {
      return res.send(200, {
        payload,
        message: "deteFun ID Thành công",
      });
    }

    return res.send(200, {
      message: "k tim thay danh muc",
    });
  } catch (error) {
    res.send(400, {
      message: " deteFun ID Thất bại",
      errors: error,
    });
  }
};

module.exports = {
  getAll,
  postCreate,
  getSearch,
  getDetail,
  update,
  deteFun,
};
