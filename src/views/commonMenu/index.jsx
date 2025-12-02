import React from 'react'
import MenuTable from './components/MenuTable'
// import { useDispatch } from 'react-redux'
// import { getMenuData, getMenuDataCount } from 'container/commonMenuContainer/slice'

const CommonMenu = ({ menuConfig }) => {
    // const dispatch = useDispatch()
    return (
        <div>
            <MenuTable menuConfig={menuConfig} />
        </div>
    )
}

export default CommonMenu