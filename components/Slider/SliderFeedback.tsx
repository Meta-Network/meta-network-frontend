import React from 'react'
import { StyledSliderToggle, StyledSliderBottomLink } from './Style'
import { MatrixIcon } from '../Icon/Index'
import { FeedbackLink } from '../../common/config'

interface SliderContenAccoountProps {
  readonly visible: boolean
}

const SliderFeedback: React.FC<SliderContenAccoountProps> = React.memo(function SliderFeedback({
	visible
}) {

	return (
		<StyledSliderToggle visible={visible}>
			<StyledSliderBottomLink
				href={ FeedbackLink }
				target="_blank"
				rel="noopener noreferrer">
				<MatrixIcon />
			</StyledSliderBottomLink>
		</StyledSliderToggle>
	)
})

export default SliderFeedback