const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Base Menu model that will be extended by specific menu types
const Menu = sequelize.define('Menu', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  numberOfPeople: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1
  },
  menuType: {
    type: DataTypes.STRING,
    allowNull: false
  },
  dayOfWeek: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']]
    }
  },
  mealType: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['breakfast', 'lunch', 'dinner']]
    }
  }
}, {
  timestamps: true
});

// Normal Menu model
const NormalMenu = sequelize.define('NormalMenu', {}, { timestamps: true });
NormalMenu.belongsTo(Menu);
Menu.hasOne(NormalMenu);

// Kids Menu model
const KidsMenu = sequelize.define('KidsMenu', {
  ageRange: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: '3-12'
  }
}, { timestamps: true });
KidsMenu.belongsTo(Menu);
Menu.hasOne(KidsMenu);

// Allergy Menu model
const AllergyMenu = sequelize.define('AllergyMenu', {
  allergens: {
    type: DataTypes.STRING,
    allowNull: false,
    get() {
      const value = this.getDataValue('allergens');
      return value ? value.split(',') : [];
    },
    set(val) {
      this.setDataValue('allergens', Array.isArray(val) ? val.join(',') : val);
    }
  }
}, { timestamps: true });
AllergyMenu.belongsTo(Menu);
Menu.hasOne(AllergyMenu);

module.exports = {
  Menu,
  NormalMenu,
  KidsMenu,
  AllergyMenu
};