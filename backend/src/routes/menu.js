const express = require('express');
const router = express.Router();
const { Menu, NormalMenu, KidsMenu, AllergyMenu } = require('../models');

// Get all menus
router.get('/', async (req, res) => {
  try {
    const menus = await Menu.findAll({
      include: [
        { model: NormalMenu, required: false },
        { model: KidsMenu, required: false },
        { model: AllergyMenu, required: false }
      ]
    });
    res.json(menus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get menu by type (normal, kids, allergy)
router.get('/type/:type', async (req, res) => {
  try {
    const { type } = req.params;
    let menus;
    
    switch(type.toLowerCase()) {
      case 'normal':
        menus = await NormalMenu.findAll({
          include: [Menu]
        });
        break;
      case 'kids':
        menus = await KidsMenu.findAll({
          include: [Menu]
        });
        break;
      case 'allergy':
        menus = await AllergyMenu.findAll({
          include: [Menu]
        });
        break;
      default:
        return res.status(400).json({ error: 'Invalid menu type' });
    }
    
    res.json(menus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get weekly menu
router.get('/weekly', async (req, res) => {
  try {
    const menus = await Menu.findAll({
      include: [
        { model: NormalMenu, required: false },
        { model: KidsMenu, required: false },
        { model: AllergyMenu, required: false }
      ],
      order: [
        ['dayOfWeek', 'ASC'],
        ['mealType', 'ASC']
      ]
    });
    
    // Organize by day of week
    const weeklyMenu = {
      monday: { breakfast: [], lunch: [], dinner: [] },
      tuesday: { breakfast: [], lunch: [], dinner: [] },
      wednesday: { breakfast: [], lunch: [], dinner: [] },
      thursday: { breakfast: [], lunch: [], dinner: [] },
      friday: { breakfast: [], lunch: [], dinner: [] },
      saturday: { breakfast: [], lunch: [], dinner: [] },
      sunday: { breakfast: [], lunch: [], dinner: [] }
    };
    
    menus.forEach(menu => {
      if (weeklyMenu[menu.dayOfWeek] && weeklyMenu[menu.dayOfWeek][menu.mealType]) {
        weeklyMenu[menu.dayOfWeek][menu.mealType].push(menu);
      }
    });
    
    res.json(weeklyMenu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create new menu item
router.post('/', async (req, res) => {
  try {
    const { name, description, numberOfPeople, menuType, dayOfWeek, mealType, ...specificData } = req.body;
    
    // Create the base menu
    const menu = await Menu.create({
      name,
      description,
      numberOfPeople,
      menuType,
      dayOfWeek,
      mealType
    });
    
    // Create the specific menu type
    let specificMenu;
    switch(menuType.toLowerCase()) {
      case 'normal':
        specificMenu = await NormalMenu.create({
          MenuId: menu.id
        });
        break;
      case 'kids':
        specificMenu = await KidsMenu.create({
          MenuId: menu.id,
          ageRange: specificData.ageRange || '3-12'
        });
        break;
      case 'allergy':
        specificMenu = await AllergyMenu.create({
          MenuId: menu.id,
          allergens: specificData.allergens || []
        });
        break;
      default:
        return res.status(400).json({ error: 'Invalid menu type' });
    }
    
    res.status(201).json({ menu, specificMenu });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update menu item
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, numberOfPeople, menuType, dayOfWeek, mealType, ...specificData } = req.body;
    
    // Update the base menu
    const menu = await Menu.findByPk(id);
    if (!menu) {
      return res.status(404).json({ error: 'Menu not found' });
    }
    
    await menu.update({
      name,
      description,
      numberOfPeople,
      dayOfWeek,
      mealType
    });
    
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete menu item
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const menu = await Menu.findByPk(id);
    
    if (!menu) {
      return res.status(404).json({ error: 'Menu not found' });
    }
    
    await menu.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;