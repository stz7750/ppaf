/**
 *packageName    : stz-
 * fileName       : MenuForm
 * author         : stz
 * date           : 7/21/24
 * description    :
 * ===========================================================
 * DATE              AUTHOR             NOTE
 * -----------------------------------------------------------
 * 7/21/24        stz       최초 생성
 */
import React, { useState, useEffect } from 'react';

const MenuForm = ({ menu, onSubmit }) => {
  const [formData, setFormData] = useState({
    menuId: '',
    menuName: '',
    parentMenuId: '',
    menuSeq: '',
    menuPath: '',
    pathName: '',
  });

  useEffect(() => {
    if (menu) {
      setFormData(menu);
    } else {
      setFormData({
        menuId: '',
        menuName: '',
        parentMenuId: '',
        menuSeq: '',
        menuPath: '',
        pathName: '',
      });
    }
  }, [menu]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div>
      <h2>{menu ? 'Edit Menu' : 'Add Menu'}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Menu Name</label>
          <input
            type="text"
            name="menuName"
            value={formData.menuName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Parent Menu ID</label>
          <input
            type="text"
            name="parentMenuId"
            value={formData.parentMenuId}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Menu Sequence</label>
          <input
            type="text"
            name="menuSeq"
            value={formData.menuSeq}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Menu Path</label>
          <input
            type="text"
            name="menuPath"
            value={formData.menuPath}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Path Name</label>
          <input
            type="text"
            name="pathName"
            value={formData.pathName}
            onChange={handleChange}
          />
        </div>
        <button type="submit">{menu ? 'Update Menu' : 'Add Menu'}</button>
      </form>
    </div>
  );
};

export default MenuForm;