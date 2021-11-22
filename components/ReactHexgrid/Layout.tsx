

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Orientation from './models/Orientation'
import Point from './models/Point'

interface IProps {
  readonly size: { x: number, y: number }
  readonly className: string
  readonly flat: boolean
  onClick: (e: React.MouseEvent<SVGGElement, MouseEvent>) => void
  onMouseOver: (e: React.MouseEvent<SVGGElement, MouseEvent>) => void
  onMouseOut: (e: React.MouseEvent<SVGGElement, MouseEvent>) => void
}
interface IState {
}

class Layout extends Component<IProps, IState> {
  static LAYOUT_FLAT = new Orientation(3.0 / 2.0, 0.0, Math.sqrt(3.0) / 2.0, Math.sqrt(3.0), 2.0 / 3.0, 0.0, -1.0 / 3.0, Math.sqrt(3.0) / 3.0, 0.0);
  static LAYOUT_POINTY = new Orientation(Math.sqrt(3.0), Math.sqrt(3.0) / 2.0, 0.0, 3.0 / 2.0, Math.sqrt(3.0) / 3.0, -1.0 / 3.0, 0.0, 2.0 / 3.0, 0.5);

  static propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    flat: PropTypes.bool,
    origin: PropTypes.object,
    size: PropTypes.object,
    spacing: PropTypes.number,
    onClick: PropTypes.func,
    onMouseOver: PropTypes.func,
    onMouseOut: PropTypes.func
  };

  static defaultProps = {
    size: new Point(10, 10),
    flat: true,
    spacing: 1.0,
    origin: new Point(0, 0)
  }

  static childContextTypes = {
    layout: PropTypes.object, // TODO Shape
    points: PropTypes.string
  };

  getChildContext() {
    const { children, flat, className, ...rest } = this.props
    const orientation = (flat) ? Layout.LAYOUT_FLAT : Layout.LAYOUT_POINTY
    const cornerCoords = this.calculateCoordinates(orientation)
    const points = cornerCoords.map(point => `${point.x},${point.y}`).join(' ')
    const childLayout = Object.assign({}, rest, { orientation })

    return {
      layout: childLayout,
      points
    }
  }
  getPointOffset(corner: number, orientation: Orientation, size: { x: number, y: number }) {
    let angle = 2.0 * Math.PI * (corner + orientation.startAngle) / 6
    return new Point(size.x * Math.cos(angle), size.y * Math.sin(angle))
  }

  // TODO Refactor
  calculateCoordinates(orientation: Orientation) {
    const corners: Point[] = []
    const center = new Point(0, 0)
    const { size } = this.props

    Array.from(new Array(6), (x, i) => {
      const offset = this.getPointOffset(i, orientation, size)
      const point = new Point(center.x + offset.x, center.y + offset.y)
      corners.push(point)
    })

    return corners
  }

  render() {
    const { children, className, onClick, onMouseOver, onMouseOut } = this.props
    return (
      <g 
      className={className} 
      onClick={(e: React.MouseEvent<SVGGElement, MouseEvent>) => onClick(e)} 
      onMouseOver={(e: React.MouseEvent<SVGGElement, MouseEvent>) => onMouseOver(e)} 
      onMouseOut={(e: React.MouseEvent<SVGGElement, MouseEvent>) => onMouseOut(e)}
      >
        {children}
      </g>
    )
  }
}

export default Layout