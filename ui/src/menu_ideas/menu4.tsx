import React from 'react';

import { ChevronDownIcon } from '@chakra-ui/icons'
import { Box, Flex, Menu, MenuButton, MenuList, MenuItem,  HStack, Text } from '@chakra-ui/react';
import { Link } from "react-router-dom";



export default function MenuIdea4() {

  const MenuButtonStyle = { bg: "#335075", borderColor: "white", fontSize: "20px", color: "white", h: '60px', fontFamily: '["Times New Roman", "Times", "serif"]', _hover: { color: "white", fontWeight:'bold',textDecor:'underline' } }
  const MenuListStyle = { bg: "#edf2f7", borderColor: "rgb(0,0,0, 0.2)", boxShadow: " 2px 2px #888888", fontSize: "20px", color: "white", _hover: { bg: "#edf2f7", color: "black" } }
  const MenuItemStlye = { bg: "#edf2f7", borderColor: "black", borderRadius: "1px", color: "black", fontSize: "20px", _hover: { bg: "#335075", color: "white" } }

  function JobsMenu() {
    return (
      <>
        <Menu >
          <MenuButton {...MenuButtonStyle}>
            <Text> Jobs<ChevronDownIcon /> </Text>
          </MenuButton>
          <MenuList {...MenuListStyle} >
            <MenuItem {...MenuItemStlye}>
              <Link to="/">Empty link 1</Link> </MenuItem>
            <MenuItem {...MenuItemStlye}>
              <Link to="/">jobsLink1</Link></MenuItem>
            <MenuItem {...MenuItemStlye}>
              <Link to="/">jobsLink2</Link></MenuItem>
            <MenuItem {...MenuItemStlye}>
              <Link to="/">jobsLink3</Link></MenuItem>
          </MenuList>
        </Menu>
      </>
    )
  }
  function ImmigrationMenu() {
    return (
      <>
        <Menu isLazy >
          <MenuButton {...MenuButtonStyle}>
            <Text>Immigration  <ChevronDownIcon />  </Text>
          </MenuButton>
          <MenuList {...MenuListStyle} >
            <MenuItem {...MenuItemStlye} >
              <Link to='/'>immigrationlink 1  </Link>  </MenuItem>
            <MenuItem {...MenuItemStlye}>
              <Link to='/'>immigrationlink 2  </Link>  </MenuItem>
            <MenuItem {...MenuItemStlye}>
              <Link to='/'>immigrationlink 3  </Link>  </MenuItem>
          </MenuList>
        </Menu>
      </>
    )
  }
  function TravelMenu() {
    return (
      <>
        <Menu isLazy >
          <MenuButton {...MenuButtonStyle} >
            <Text> Travel  <ChevronDownIcon />  </Text>
          </MenuButton>
          <MenuList {...MenuListStyle}>
            <MenuItem {...MenuItemStlye}>
              <Link to='/'>Link 1  </Link>  </MenuItem>
            <MenuItem {...MenuItemStlye}>
              <Link to='/'>Link 2  </Link>  </MenuItem>
            <MenuItem {...MenuItemStlye}>
              <Link to='/'>Link 3  </Link>  </MenuItem>
          </MenuList>
        </Menu>
      </>
    )
  }
  function BusinessMenu() {
    return (
      <>
        <Menu isLazy >
          <MenuButton {...MenuButtonStyle} >
            <Text> Business  <ChevronDownIcon />  </Text>
          </MenuButton>
          <MenuList {...MenuListStyle}>
            <MenuItem {...MenuItemStlye}>
              <Link to='/'>Link 1  </Link>  </MenuItem>
            <MenuItem {...MenuItemStlye}>
              <Link to='/'>Link 2  </Link>  </MenuItem>
            <MenuItem {...MenuItemStlye}>
              <Link to='/'>Link 3  </Link>  </MenuItem>
          </MenuList>
        </Menu>
      </>
    )
  }
  function BenefitsMenu() {
    return (
      <>
        <Menu isLazy >
          <MenuButton {...MenuButtonStyle} >
            <Text> Benefits  <ChevronDownIcon />  </Text>
          </MenuButton>
          <MenuList {...MenuListStyle}>
            <MenuItem {...MenuItemStlye}>
              <Link to='/'>Link 1  </Link>  </MenuItem>
            <MenuItem {...MenuItemStlye}>
              <Link to='/'>Link 2  </Link>  </MenuItem>
            <MenuItem {...MenuItemStlye}>
              <Link to='/'>Link 3  </Link>  </MenuItem>
          </MenuList>
        </Menu>
      </>
    )
  }
  function HealthMenu() {
    return (
      <>
        <Menu isLazy >
          <MenuButton {...MenuButtonStyle} >
            <Text> Health  <ChevronDownIcon />  </Text>
          </MenuButton>
          <MenuList {...MenuListStyle}>
            <MenuItem {...MenuItemStlye}>
              <Link to='/'>Link 1  </Link>  </MenuItem>
            <MenuItem {...MenuItemStlye}>
              <Link to='/'>Link 2  </Link>  </MenuItem>
            <MenuItem {...MenuItemStlye}>
              <Link to='/'>Link 3  </Link>  </MenuItem>
          </MenuList>
        </Menu>
      </>
    )
  }
  function TaxesMenu() {
    return (
      <>
        <Menu isLazy >
          <MenuButton {...MenuButtonStyle} >
            <Text> Taxes  <ChevronDownIcon />  </Text>
          </MenuButton>
          <MenuList {...MenuListStyle}>
            <MenuItem {...MenuItemStlye}>
              <Link to='/'>Link 1  </Link>  </MenuItem>
            <MenuItem {...MenuItemStlye}>
              <Link to='/'>Link 2  </Link>  </MenuItem>
            <MenuItem {...MenuItemStlye}>
              <Link to='/'>Link 3  </Link>  </MenuItem>
          </MenuList>
        </Menu>
      </>
    )
  }
  function MoreServicesMenu() {
    return (
      <>
        <Menu isLazy >
          <MenuButton {...MenuButtonStyle} >
            <Text> More Services  <ChevronDownIcon />  </Text>
          </MenuButton>
          <MenuList {...MenuListStyle}>
            <MenuItem {...MenuItemStlye}>
              <Link to='/'>Link 1  </Link>  </MenuItem>
            <MenuItem {...MenuItemStlye}>
              <Link to='/'>Link 2  </Link>  </MenuItem>
            <MenuItem {...MenuItemStlye}>
              <Link to='/'>Link 3  </Link>  </MenuItem>
          </MenuList>
        </Menu>
      </>
    )
  }

  return (
    <>
      <Box>
          <Flex h={16} alignItems={'center'} justifyContent={'space-around'} bg="#335075" >           
            <HStack spacing={8} alignItems={'center'} >
              <JobsMenu />
              <ImmigrationMenu />
              <TravelMenu />
              <BusinessMenu />
              <BenefitsMenu />
              <HealthMenu />
              <TaxesMenu />
              <MoreServicesMenu />
            </HStack>
          </Flex>
      </Box>
    </>
  )
}