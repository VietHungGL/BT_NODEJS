const { fuzzySearch } = require("../../helper");
const { Product, Category, Supplier } = require("../../models");

const getAll = async (req, res, next) => {
  try {
    let results = await Product.find({
      isDeleted: false,
    })
      .populate("category")
      .populate("supplier")
      .lean(); // se bo di truong` discountedPrice

    const total = await Product.countDocuments({ isDeleted: false });
    return res.send({ code: 200, payload: results, total });
  } catch (err) {
    return res.send(404, {
      message: "Không tìm thấy",
      err,
    });
  }
};

const getList = async (req, res, next) => {
  // NOTE
  try {
    const { page, pageSize } = req.query;
    const limit = pageSize || 1;
    const skip = limit * (page - 1) || 0;

    const conditionFind = { isDeleted: false };

    let results = await Product.find(conditionFind)
      .populate("category")
      .populate("supplier")
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Product.countDocuments(conditionFind);

    return res.send({ code: 200, payload: results, total });
  } catch (err) {
    return res.send(404, {
      message: "Không tìm thấy",
      err,
    });
  }
};

//Hàm  tạo
const postCreate = async (req, res, next) => {
  try {
    const {
      name,
      price,
      discount,
      stock,
      description,
      supplierId,
      categoryId,
    } = req.body;

    const getSupplier = Supplier.findOne({
      _id: supplierId,
      isDeleted: false,
    });

    const getCategory = Category.findOne({
      _id: categoryId,
      isDeleted: false,
    });

    const [existSupplier, existCategory] = await Promise.all([
      getSupplier,
      getCategory,
    ]);

    const error = [];
    if (!existSupplier) error.push("Nhà cung cấp không khả dụng");
    if (!existCategory) error.push("Danh mục không khả dụng");

    if (error.length > 0) {
      return res.send(400, {
        error,
        message: "Không khả dụng",
      });
    }

    // Cach lam co dien
    // if (!existSupplier && !existCategory) {
    //   return res.send(400, {
    //     message: "Nhà cung cấp & Danh mục không khả dụng",
    //   });
    // }
    // if (!existSupplier) {
    //   return res.send(400, {
    //     message: "Nhà cung cấp không khả dụng",
    //   });
    // }
    // if (!existCategory) {
    //   return res.send(400, {
    //     message: "Danh mục không khả dụng",
    //   });
    // }

    const newRecord = new Product({
      name,
      price,
      discount,
      stock,
      description,
      supplierId,
      categoryId,
    });

    let result = await newRecord.save();

    return res.send(200, {
      message: "Thành công",
      payload: result,
    });
  } catch (error) {
    console.log("««««« error »»»»»", error);
    return res.send(404, {
      message: "Có lỗi",
      error,
    });
  }
};

const getSearch = async (req, res, next) => {
  try {
    const {
      keyword,
      categoryId,
      priceStart,
      priceEnd,
      supplierId,
      page,
      pageSize,
      stockStart,
      stockEnd,
      discountStart,
      discountEnd,
    } = req.query;
    const limit = pageSize || 12; // 10
    const skip = limit * (page - 1) || 0;

    const conditionFind = { isDeleted: false };

    if (keyword) conditionFind.name = fuzzySearch(keyword);

    if (categoryId) {
      conditionFind.categoryId = categoryId;
      // conditionFind.$expr = { $eq: ['$categoryId', categoryId] };
    }

    if (supplierId) {
      conditionFind.supplierId = supplierId;
    }

    if (priceStart && priceEnd) {
      // 20 - 50
      const compareStart = { $lte: ["$price", priceEnd] }; // '$field'
      const compareEnd = { $gte: ["$price", priceStart] };
      conditionFind.$expr = { $and: [compareStart, compareEnd] };
    } else if (priceStart) {
      conditionFind.price = { $gte: parseFloat(priceStart) };
    } else if (priceEnd) {
      conditionFind.price = { $lte: parseFloat(priceEnd) };
    }

    if (stockStart && stockEnd) {
      const compareStart = { $lte: ["$stock", stockEnd] };
      const compareEnd = { $gte: ["$stock", stockStart] };
      conditionFind.$expr = { $and: [compareStart, compareEnd] };
    } else if (stockStart) {
      conditionFind.price = { $gte: parseFloat(stockStart) };
    } else if (stockEnd) {
      conditionFind.price = { $lte: parseFloat(stockEnd) };
    }

    const result = await Product.find(conditionFind)
      .populate("category")
      .populate("supplier")
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(conditionFind);

    res.send(200, {
      message: "Thành công",
      payload: result,
      total,
    });
  } catch (error) {
    return res.send(404, {
      message: "Không tìm thấy",
    });
  }
};

const getDetail = async (req, res, next) => {
  try {
    const { id } = req.params;

    let result = await Product.findOne({
      _id: id,
      isDeleted: false,
    })
      .populate("category")
      .populate("supplier");

    if (result) {
      return res.send({ code: 200, payload: result });
    }

    return res.status(404).send({ code: 404, message: "Không tìm thấy" });
  } catch (err) {
    res.status(404).json({
      message: "Get detail fail!!",
      payload: err,
    });
  }
};

const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      name,
      price,
      discount,
      stock,
      description,
      supplierId,
      categoryId,
    } = req.body;

    // Kiểm tra sản phẩm có tồn tại và không bị xóa
    const product = await Product.findOne({ _id: id, isDeleted: false });

    if (!product) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    }
    const error = [];

    // Kiểm tra xem nhà cung cấp có tồn tại và không bị xóa
    if (product.supplierId.toString() !== supplierId.toString()) {
      const supplier = await Supplier.findOne({
        _id: supplierId,
        isDeleted: false,
      });

      if (!supplier) error.push("Nhà cung cấp không khả dụng");
    }

    // Kiểm tra xem danh mục có tồn tại và không bị xóa
    if (product.categoryId.toString() !== categoryId) {
      const category = await Category.findOne({
        _id: categoryId,
        isDeleted: false,
      });

      if (!category) error.push("Danh mục không khả dụng");
    }

    if (error.length > 0) {
      return res.send(400, {
        error,
        message: "Không khả dụng",
      });
    }

    //Cập nhật sản phẩm
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, price, discount, stock, description, supplierId, categoryId },
      { new: true }
    );

    if (updatedProduct) {
      return res.status(200).json({
        message: "Cập nhật thành côngl",
        payload: updatedProduct,
      });
    }

    return res.status(400).json({ message: "Cập nhật thất bại!" });
  } catch (error) {
    console.log("««««« error »»»»»", error);
    return res.send(404, {
      message: "Có lỗi",
      error,
    });
  }
};

const deteFun = async (req, res, next) => {
  try {
    const { id } = req.params;

    const payload = await Product.findOneAndUpdate(
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
  getList,
  postCreate,
  getSearch,
  getDetail,
  update,
  deteFun,
};
