import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { HexUtils, Hex } from 'react-hexgrid'
import { assign } from 'lodash'
import { animated } from 'react-spring'
import { hexGridsByFilterState } from '../../typings/metaNetwork'

interface IProps {
  q: number
  r: number
  s: number
  className: string
}
interface IState {}

class HexagonRound extends PureComponent<IProps, IState> {
  static contextTypes = {
    layout: PropTypes.object, // TODO Shape
    points: PropTypes.string
  };

  constructor(props: any, context: any) {
    super(props, context)
    const { q, r, s } = props
    const { layout } = context
    const hex = new Hex(q, r, s)
    const pixel = HexUtils.hexToPixel(hex, layout)
    this.state = { hex, pixel, q, r, s }
  }

  // TODO Refactor to reduce duplicate
  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(nextProps: any) {
    const { q, r, s } = nextProps
    const { layout } = this.context
    const hex = new Hex(q, r, s)
    const pixel = HexUtils.hexToPixel(hex, layout)
    this.setState({ hex, pixel, q, r, s })
  }

  render() {
    const { fill, cellStyle, className } = (this.props as any)
    const { points } = this.context
    const { hex, pixel, q, r, s } = (this.state as any)
    const fillId = (fill) ? `url(#${fill})` : null

    const styles = assign(cellStyle, {
      // 因为 path 有偏差，用 transform 复位
      transform: 'translate(-58px, -63.4px)'
    })

    return (
      <g className={classNames('hexagon-group', className)}
        transform={`translate(${pixel.x}, ${pixel.y})`}
        data-q={q}
        data-r={r}
        data-s={s}
      >
        <g className="hexagon">
          <path fill={fillId!} style={styles} d="M75.3649,7.43654 L97.5784,20.2615 C104.108,24.0316 107.236,25.8466 109.506,28.3673 C111.529,30.6146 113.058,33.2622 113.992,36.1383 C115.04,39.3642 115.048,42.9803 115.048,50.5205 L115.048,76.1704 C115.048,83.7107 115.04,87.3267 113.992,90.5527 C113.058,93.4288 111.529,96.0763 109.506,98.3237 C107.236,100.844 104.108,102.659 97.5784,106.429 L75.3649,119.254 C68.8348,123.025 65.6993,124.826 62.3815,125.531 C59.4234,126.16 56.3663,126.16 53.4083,125.531 C50.0904,124.826 46.9549,123.025 40.4248,119.254 L18.2113,106.429 C11.6813,102.659 8.5537,100.844 6.28404,98.3237 C4.26052,96.0763 2.73194,93.4288 1.79744,90.5527 C0.749273,87.3267 0.741272,83.7107 0.741272,76.1704 L0.741272,50.5205 C0.741272,42.9803 0.749273,39.3642 1.79744,36.1383 C2.73194,33.2622 4.26052,30.6146 6.28404,28.3673 C8.5537,25.8466 11.6813,24.0316 18.2113,20.2615 L40.4248,7.43654 C46.9549,3.66641 50.0904,1.86532 53.4083,1.1601 C56.3663,0.531351 59.4234,0.531351 62.3815,1.1601 C65.6993,1.86532 68.8348,3.66641 75.3649,7.43654 Z"></path>
          {this.props.children}
        </g>
      </g>
    )
  }
}

export default HexagonRound