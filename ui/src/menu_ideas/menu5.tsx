import React from 'react';

import { Link, Box, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';

export default function MenuIdea5() {

    return (
        <>
            <Box bg='black' color='white' fontSize='16px' p={2}>
                <Menu >
                    <MenuButton > Menu
                    </MenuButton>
                    <MenuList color='black' >
                        <MenuItem  >
                            <Link href='/'>Home</Link>
                        </MenuItem>
                        <MenuItem  >
                            <Link href='/secondpage'>secondpage</Link>
                        </MenuItem>
                        <MenuItem  >
                            <Link href='/thirdpage'>thirdpage</Link>
                        </MenuItem>
                        <MenuItem  >
                            <Link href='/pagefour'>pagefour</Link>
                        </MenuItem>
                        <MenuItem  >
                            <Link href='/pagefive'>pagefive</Link>
                        </MenuItem>
                        <MenuItem  >
                            <Link href='/pagesix'>pagesix</Link>
                        </MenuItem>
                    </MenuList>
                </Menu>
            </Box>
            <Outlet />
        </>

    )
}