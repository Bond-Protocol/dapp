import { Menu } from "@mui/base/Menu";
import { MenuButton } from "@mui/base/MenuButton";
import { MenuItem } from "@mui/base/MenuItem";
import { Dropdown } from "@mui/base/Dropdown";
import { NavLink } from "./NavLink";

export const NavMenu = (props: {
  label: string;
  links: Array<{ url: string; label: string }>;
}) => {
  return (
    <Dropdown>
      <MenuButton className="hover:text-light-secondary bp-transition my-auto font-mono uppercase">
        {props.label}
      </MenuButton>
      <Menu className="navmenu-bg z-50 rounded-lg px-8 pt-2 pb-4 border-t-0">
        {props.links.map((p, i) => (
          <MenuItem key={i} className="my-2">
            <NavLink {...p} />
          </MenuItem>
        ))}
      </Menu>
    </Dropdown>
  );
};
