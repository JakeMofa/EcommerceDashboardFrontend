import styled from "styled-components";

const Wrapper = styled.div`
  .ant-menu,
  .ant-menu-root,
  .ant-menu-inline,
  .ant-menu-light {
    background: #fff !important;
    color: #2d2e32;
    font-size: 1.08rem !important;
    svg {
      height: 1.75rem !important;
      width: 1.75rem !important;
    }
    svg [fill]:not(.permanent):not(g) {
      transition: fill 0.3s ease;
      fill: #000;
    }
    :where(.css-dev-only-do-not-override-1cwp3y8).ant-menu-dark
      .ant-menu-item:hover:not(.ant-menu-item-selected):not(
        .ant-menu-submenu-selected
      ),
    :where(.css-dev-only-do-not-override-1cwp3y8).ant-menu-dark
      .ant-menu-submenu-title:hover:not(.ant-menu-item-selected):not(
        .ant-menu-submenu-selected
      ) {
      background-image: linear-gradient(45deg, #000000, #3e3e3e) !important;
      color: #ff643c !important;
      svg [fill]:not(.permanent):not(g) {
        fill: #ff643c !important;
      }
      .bullet {
        background-color: #ffffff;
      }
      
    }
    :where(.css-dev-only-do-not-override-1l14yfp).ant-menu-light.ant-menu-root.ant-menu-vertical {
      border-inline-end: 0px ; 
    }
    
    .ant-menu-item:hover {
        background: #ff643c12 !important;
        color: #ff643c !important;
        svg [fill]:not(.permanent):not(g) {
          transition: fill 0.1s ease;
          fill: #ff643c !important;
        }
        .bullet {
          background: #ff643c !important;
        }
    }
    .ant-menu-item-selected {
      background-image: linear-gradient(45deg, #000000, #3e3e3e);
      color: #ffffff;
      svg [fill]:not(.permanent):not(g) {
        transition: fill 0.3s ease;
        fill: #ffffff;
      }
      .bullet {
        background-color: #ffffff;
      }
    }
  }
  .ant-menu-submenu-selected > .ant-menu-submenu-title {
    background: #ff643c12;
    color: #ff643c;
    svg [fill]:not(.permanent):not(g) {
      transition: fill 0.3s ease;
      fill: #ff643c;
    }
    &:hover {
      background: #ff643c12;
      color: #ff643c;
      svg [fill]:not(.permanent):not(g) {
        transition: fill 0.3s ease;
        fill: #ff643c !important;
      }
    }
  }
  .ant-menu-submenu-title {
    padding-inline-end: 38px;
  }
  .ant-menu-title-content .bullet-dot {
    width: 5px;
    height: 4.5px;
  }
  .ant-menu-item {
    :where(.css-dev-only-do-not-override-i56vxb).ant-menu-vertical .ant-menu-item
      height: 35px !important;
      line-height: 47px !important;
    }

  .ant-menu-title-content{
    font-weight: 500;
  }
  .ant-menu-light.ant-menu-root.ant-menu-vertical {
    border-inline-end: 0px ; 
  }

  .arrow {
    background: white;
    width: 30px;
    height: 30px;
    border-radius: 32px;
    color: #000;
    padding-left: 7px;
    box-shadow: 0px 0px 10px #d2d2d2;
    padding-top: 5px;
    left: 47px;
    position: relative;
    z-index: 100;
    top: 5px;
    svg,
    span {
      cursor: pointer;
    }
  }
  .ant-menu-inline-collapsed {
    border-inline-end: none !important;
  }

  .ant-menu-item:hover {
        color: #ff643c !important;
    .ant-menu-title-content {
        color: #ff643c !important;
    }
    
  }
  .ant-menu-submenu-title:hover {
    background-image: #ff643c12 !important;
    color: #ff643c !important;
      svg [fill]:not(.permanent):not(g) {
        transition: fill 0.3s ease;
        fill: #ff643c !important;
      }
  }
  .ant-menu-light {

  
    .ant-menu-item-selected {
        &:hover {
          background-image: linear-gradient(45deg, #000000, #3e3e3e) !important;
          color: #ffffff !important;
          .bullet {
            background-color: #ffffff !important;
          }
          .ant-menu-title-content {
            color: #FFFFFF !important;
          }
        }
    }
  }
`;

export default Wrapper;
