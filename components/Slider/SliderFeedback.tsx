import React from 'react'
import { Tooltip } from 'antd'
import { StyledSliderToggle, StyledSliderBottomLink } from './Style'
import { FeedbackLink } from '../../common/config'
import { MatrixIcon } from '../Icon/Index'

interface Props {
  readonly visible: boolean
}

const SliderFeedback: React.FC<Props> = React.memo(function SliderFeedback({
  visible
}) {

  return (
    <StyledSliderToggle visible={visible}>
      <Tooltip placement="right" title={'Feedback'}>
        <StyledSliderBottomLink
          href={ FeedbackLink }
          target="_blank"
          rel="noopener noreferrer">
          <MatrixIcon />
        </StyledSliderBottomLink>
      </Tooltip>
    </StyledSliderToggle>
  )
})

export default SliderFeedback