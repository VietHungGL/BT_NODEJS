const { fuzzySearch } = require("../../helper");

const { Employees } = require("../../models");

const getAll = async (req, res, next) => {
  try {
    const payload = await Employees.find({ isDeleted: false });

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
    const {
      firstName,
      lastName,
      phoneNumber,
      address,
      email,
      birthday,
      password,
    } = req.body;

    const newEmployees = new Employees({
      firstName,
      lastName,
      phoneNumber,
      address,
      email,
      birthday,
      password,
    });
    const payload = await newEmployees.save();

    res.send(200, {
      payload,
      message: "Tao Thành công",
    });
    console.log("««««« newEmployees »»»»»", newEmployees);
  } catch (error) {
    res.send(400, {
      message: "Tao Thất bại",
      errors: error,
    });
  }
};

const getSearch = async (req, res, next) => {
  try {
    const { email, address, firstName, lastName } = req.query;
    const conditionFind = { isDeleted: false };

    if (email) {
      conditionFind.email = fuzzySearch(email);
    }

    if (address) conditionFind.address = fuzzySearch(address);
    if (firstName) conditionFind.firstName = fuzzySearch(firstName);
    if (lastName) conditionFind.lastName = fuzzySearch(lastName);

    // console.log("««««« conditionFind »»»»»", conditionFind);

    const payload = await Employees.find(conditionFind);

    res.send(200, {
      payload,
      message: "Tim Kiem Thành công",
    });
  } catch (error) {
    console.log("««««« error »»»»»", error);
    res.send(400, {
      message: " Tim Kiem Thất bại",
      errors: error,
    });
  }
};

const getDetail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = await Employees.findOne({
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
  try {
    const { id } = req.params;

    const payload = await Employees.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { ...req.body },
      { new: true }
    );

    if (payload) {
      return res.send(200, {
        payload,
        message: "Cập nhập thành công",
      });
    }
    return res.send(404, { message: "Không tìm thấy" });
  } catch (error) {
    console.log("««««« error »»»»»", error);
    res.send(400, {
      error,
      message: "Cập nhập không thành công",
    });
  }
};

const deteFun = async (req, res, next) => {
  try {
    const { id } = req.params;

    const payload = await Employees.findOneAndUpdate(
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
