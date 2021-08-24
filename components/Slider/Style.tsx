import styled from 'styled-components'
import { animated } from 'react-spring'
import { Drawer } from 'antd';

export const StyledSliderCAccount = styled.section<{ visible: boolean }>`
  padding: ${props => props.visible ? '0 18px 0 0;' : '0 8px 0 0;'};
  margin: auto 0 0 0;
`
export const StyledSliderCAccountButton = styled.button<{ visible: boolean }>`
  font-family: ${props => props.theme.fontFamilyZH};
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  background-color: transparent;
  border: none;
  outline: none;
  padding: 8px 16px;
  background: #131313;
  box-shadow: inset 0px 1px 0px rgba(196, 196, 196, 0.2);
  border-radius: 4px;
  width: 100%;
  cursor: pointer;
  text-align: left;
  display: flex;
  align-items: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  span {
    margin-right: ${props => props.visible ? '24px' : '0;'};
  }
`

export const StyledCount = styled.span`
  display: inline-block;
  background: #CAF12E;
  border-radius: 100%;
  width: 18px;
  height: 18px;
  font-family: ${props => props.theme.fontFamilyEN};
  font-style: normal;
  font-weight: normal;
  font-size: 12px;
  line-height: 18px;
  text-align: center;
  color: #131313;
  margin-left: 30px;
`

export const StyledButton = styled(animated.button)`
  position: absolute;
  right: -58px;
  top: 74px;
  z-index: 1;
  border: none;
  border-top: 2px solid ${props => props.theme.colorGreen};
  border-right: 2px solid ${props => props.theme.colorGreen};
  border-bottom: 2px solid ${props => props.theme.colorGreen};
  border-radius: 0 4px 4px 0;
  background: rgba(19, 19, 19, 0.1);
  outline: none;
  padding: 16px;
  font-size: ${props => props.theme.fontSize4};
  color: ${props => props.theme.colorGreen};
  line-height: 24px;
  box-sizing: border-box;
  cursor: pointer;
  & > span {
    font-size: 24px;
  }
`
export const StyledButtonMap = styled(animated.button)`
  position: absolute;
  right: -58px;
  top: 162px;
  z-index: 1;
  border: none;
  border-top: 2px solid #caa2e7;
  border-right: 2px solid #caa2e7;
  border-bottom: 2px solid #caa2e7;
  border-radius: 0 4px 4px 0;
  background: rgba(19, 19, 19, 0.1);
  outline: none;
  padding: 16px;
  font-size: ${props => props.theme.fontSize4};
  color: #caa2e7;
  line-height: 24px;
  box-sizing: border-box;
  cursor: pointer;
  & > span {
    font-size: 24px;
  }
`
export const StyledSlider = styled.section<{ visible: boolean }>`
  width: ${ props => props.visible ? '256px' : '60px' };
  transition: all .2s;
  position: fixed;
  z-index: 10;
  left: 0;
  top: 0;
  bottom: 0;
  background-color: #131313;
  color: #fff;
  border-right: 2px solid ${props => props.theme.colorGreen};
`
export const StyledSliderContent = styled.section<{ visible: boolean }>`
  padding: ${props => props.visible ? '76px 0 16px 18px;' : '76px 0 16px 8px'};
  transition: all .2s;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
`

export const StyledSliderCUser = styled.section<{ visible: boolean }>`
  display: flex;
  align-items: center;
  border-color: ${props => props.theme.colorGreen};
  border-style: solid;
  border-width: 0;
  border-right-width: ${ props => props.visible ? '4px' : '0px' };
  padding: 8px 0;
  box-sizing: border-box;
  .arrow {
    opacity: ${props => props.visible ? 1 : 0};
    margin-left: auto;
    margin-right: 20px;
    color: ${props => props.theme.colorGreen};
    transition: all .2s;
  }
  .ant-avatar {
    flex: 0 0 40px;
  }
`
export const StyledSliderCUserInfo = styled.span`
  font-family: ${props => props.theme.fontFamilyZH};
  font-style: normal;
  font-weight: 500;
  font-size: 16px;
  line-height: 36px;
  color: #C4C4C4;
  margin-left: 12px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`

export const StyledSliderCItem = styled.ul<{ visible: boolean }>`
  list-style: none;
  padding: 0;
  margin: ${props => props.visible ? '24px 18px 0 0;' : '24px 0 0 0;'};

  li {
    h4 {
      font-family: ${props => props.theme.fontFamilyZH};
      font-style: normal;
      font-weight: bold;
      font-size: 12px;
      line-height: 18px;
      color: rgba(196, 196, 196, 0.4);
      padding: 0 0 8px 0;
      margin: 0;
    }
    a {
      font-family: ${props => props.theme.fontFamilyZH};
      padding: 8px 0 8px 12px;
      display: flex;
      align-items: center;
      font-style: normal;
      font-weight: normal;
      font-size: 16px;
      line-height: 24px;
      color: #C4C4C4;
      transition: all .2s;
      text-align: left;
      border-radius: 3px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      transition: all .2s;
      &:hover {
        color: ${props => props.theme.colorGreen};
        background: rgba(245, 245, 245, 0.1);
      }
      &.disabled {
        opacity: .4;
        &:hover {
          color: #C4C4C4;
          background: transparent;
        }
      }
      span {
        margin-right: 8px;
        &.right {
          margin-right: 0;
          margin-left: 8px;
        }
      }
    }
  }
`

export const StyledSliderToggle = styled.section<{ visible: boolean }>`
  margin-top: 60px;
  padding: ${props => props.visible ? '0 0 0 4px;' : '0 0 0 14px'};
  cursor: pointer;
  span {
    font-size: 16px;
  }
`