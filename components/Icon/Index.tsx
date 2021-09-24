import Icon from '@ant-design/icons'
import { svg } from 'd3-fetch'

const EmailSvg = () => (
  <svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1715"><path d="M513 583.8l448.5-448.5c-11.6-4.7-24.3-7.3-37.5-7.3H100c-12.7 0-24.9 2.4-36.1 6.7L513 583.8z" fill="" p-id="1716"></path><path d="M513 674.3L14.6 175.9C5.3 191.1 0 208.9 0 228v568c0 55.2 44.8 100 100 100h824c55.2 0 100-44.8 100-100V228c0-18.5-5.1-35.9-13.9-50.8L513 674.3z" fill="" p-id="1717"></path></svg>
)
export const EmailIcon: React.FC = props => <Icon component={EmailSvg} {...props} />

const USvg = () => (
  <svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10411"><path d="M870.515838 62.986543l0 565.154617c0 111.332644-31.92613 194.434318-95.733365 249.309112-60.59303 51.635007-147.84728 77.449953-261.761726 77.449953-50.895157 0-96.941889-6.460132-138.14736-19.371186-56.559157-17.742083-102.605889-46.37419-138.149407-85.913718-45.249577-50.823526-67.858504-121.005958-67.858504-210.568786L168.865477 62.986543l185.411827 0 0 563.791573c0 57.271378 14.538111 100.631932 43.62252 130.062218 29.084409 29.443589 66.231447 44.155662 111.48921 44.155662 60.59303 0 105.011682-14.112416 133.299959-42.341341 28.27088-28.230971 42.412972-69.37709 42.412972-123.412774L685.101965 62.986543 870.515838 62.986543z" p-id="10412"></path></svg>
)
export const UIcon: React.FC = props => <Icon component={USvg} {...props} />

const SearchSvg = () => (
  <svg className="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M192 480a256 256 0 1 1 512 0 256 256 0 0 1-512 0m631.776 362.496-143.2-143.168A318.464 318.464 0 0 0 768 480c0-176.736-143.264-320-320-320S128 303.264 128 480s143.264 320 320 320a318.016 318.016 0 0 0 184.16-58.592l146.336 146.368c12.512 12.48 32.768 12.48 45.28 0 12.48-12.512 12.48-32.768 0-45.28"/></svg>
)
export const SearchIcon: React.FC = props => <Icon component={SearchSvg} {...props} />

const SwitchVerticalSvg = () => (
  <svg className="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M469.333 384c-12.8 0-21.333-4.267-29.866-12.8l-140.8-140.8-140.8 140.8c-17.067 17.067-42.667 17.067-59.734 0s-17.066-42.667 0-59.733L268.8 140.8c17.067-17.067 42.667-17.067 59.733 0L499.2 311.467c17.067 17.066 17.067 42.666 0 59.733-8.533 8.533-17.067 12.8-29.867 12.8z"/><path d="M298.667 597.333c-25.6 0-42.667-17.066-42.667-42.666v-384c0-25.6 17.067-42.667 42.667-42.667s42.666 17.067 42.666 42.667v384c0 25.6-17.066 42.666-42.666 42.666zM725.333 896c-12.8 0-21.333-4.267-29.866-12.8L524.8 712.533c-17.067-17.066-17.067-42.666 0-59.733s42.667-17.067 59.733 0l140.8 140.8 140.8-140.8c17.067-17.067 42.667-17.067 59.734 0s17.066 42.667 0 59.733L755.2 883.2c-8.533 8.533-17.067 12.8-29.867 12.8z"/><path d="M725.333 896c-25.6 0-42.666-17.067-42.666-42.667V426.667c0-25.6 17.066-42.667 42.666-42.667S768 401.067 768 426.667v426.666c0 25.6-17.067 42.667-42.667 42.667z"/></svg>
)
export const SwitchVerticalIcon: React.FC = props => <Icon component={SwitchVerticalSvg} {...props} />

const BookmarkSvg = () => (
  <svg className="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path d="M804.907 981.333c-12.886 0-25.814-4.693-33.878-14.08L512.811 715.392 254.592 967.253c-14.507 14.08-35.499 18.774-53.248 10.966-19.37-7.851-30.677-25.046-30.677-43.819V180.352c0-76.672 62.933-137.685 142.037-137.685h398.592c77.483 0 142.037 61.013 142.037 137.685V934.4c0 18.773-11.306 35.968-30.677 43.819-4.821 3.114-11.264 3.114-17.75 3.114zM511.189 604.288c12.928 0 25.814 4.693 33.878 14.08L754.9 821.76V180.352c1.579-25.045-19.37-43.819-43.648-43.819H312.747c-25.856 0-45.227 18.774-45.227 43.819V821.76l209.835-203.392c9.685-9.387 20.992-14.08 33.877-14.08z"/></svg>
)
export const BookmarkIcon: React.FC = props => <Icon component={BookmarkSvg} {...props} />

const BookmarkFillSvg = () => (
  <svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8814"><path d="M853.333333 896a42.666667 42.666667 0 0 1-65.28 36.266667l-253.44-158.72a42.666667 42.666667 0 0 0-45.226666 0l-253.44 158.72A42.666667 42.666667 0 0 1 170.666667 896V170.666667a85.333333 85.333333 0 0 1 85.333333-85.333334h512a85.333333 85.333333 0 0 1 85.333333 85.333334z" p-id="8815"></path></svg>
)
export const BookmarkFillIcon: React.FC = props => <Icon component={BookmarkFillSvg} {...props} />

const ArrowTopLeftSvg = () => (
  <svg className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9756"><path d="M512 714.666667c-8.533333 0-17.066667-2.133333-23.466667-8.533334l-341.333333-341.333333c-12.8-12.8-12.8-32 0-44.8 12.8-12.8 32-12.8 44.8 0l320 317.866667 317.866667-320c12.8-12.8 32-12.8 44.8 0 12.8 12.8 12.8 32 0 44.8L533.333333 704c-4.266667 8.533333-12.8 10.666667-21.333333 10.666667z" p-id="9757"></path></svg>
)
export const ArrowTopLeftIcon: React.FC = props => <Icon component={ArrowTopLeftSvg} {...props} />

const InviteSvg = () => (
  // <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 2V6M2 4H6M5 16V20M3 18H7M12 2L14.2857 8.85714L20 11L14.2857 13.1429L12 20L9.71429 13.1429L4 11L9.71429 8.85714L12 2Z" stroke="currentColor" strokeWidth="2.14" strokeLinecap="round" strokeLinejoin="round" /></svg>
  <svg />
)
export const InviteIcon: React.FC = props => <Icon component={InviteSvg} {...props} />

const LogoutSvg = () => (
  // <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.11111 15.6667L4.55556 12.1111M4.55556 12.1111L8.11111 8.55556M4.55556 12.1111L17 12.1111M12.5556 15.6667V16.5556C12.5556 18.0283 11.3616 19.2222 9.88889 19.2222H3.66667C2.19391 19.2222 1 18.0283 1 16.5556V7.66667C1 6.19391 2.19391 5 3.66667 5H9.88889C11.3616 5 12.5556 6.19391 12.5556 7.66667V8.55556" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
  <svg />
)
export const LogoutIcon: React.FC = props => <Icon component={LogoutSvg} {...props} />

const SortTopSvg = () => (
  <svg width="18" height="16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1h11.375M1 4.5h7.875M1 8h5.25m3.5 0 3.5-3.5m0 0 3.5 3.5m-3.5-3.5V15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
)
export const SortTopIcon: React.FC = props => <Icon component={SortTopSvg} {...props} />

const SortDoneSvg = () => (
  <svg width="16" height="14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.108 12.75h-13m13-4h-13m13-4h-6m-2-3.5-4 4-2.5-2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
)
export const SortDoneIcon: React.FC<any> = props => <Icon component={SortDoneSvg} {...props} />

const CopySvg = () => (
  <svg width="20" height="21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.667 6.333V13c0 .92.746 1.667 1.666 1.667h5M6.667 6.333V4.667c0-.92.746-1.667 1.666-1.667h3.822c.22 0 .433.088.59.244l3.678 3.679a.833.833 0 0 1 .244.589V13c0 .92-.747 1.667-1.667 1.667h-1.667M6.667 6.333H5.333a2 2 0 0 0-2 2v8C3.333 17.253 4.08 18 5 18h6.333a2 2 0 0 0 2-2v-1.333" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
)
export const CopyIcon: React.FC = props => <Icon component={CopySvg} {...props} />

const CircleSvg = () => (
  <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.86 2h8.28L22 7.86v8.28L16.14 22H7.86L2 16.14V7.86L7.86 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 4" /></svg>
)
export const CircleIcon: React.FC = props => <Icon component={CircleSvg} {...props} />

const CircleSuccessSvg = () => (
  <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.86 2h8.28L22 7.86v8.28L16.14 22H7.86L2 16.14V7.86L7.86 2z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /><path d="m17.5 8-7.219 7.875L7 12.295" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
)
export const CircleSuccessIcon: React.FC = props => <Icon component={CircleSuccessSvg} {...props} />

const CircleWarningSvg = () => (
  <svg width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.86 2h8.28L22 7.86v8.28L16.14 22H7.86L2 16.14V7.86L7.86 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 4" /><path d="M12 16h.01M12 8v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
)
export const CircleWarningIcon: React.FC = props => <Icon component={CircleWarningSvg} {...props} />

const CircleEmptySvg = () => (
  <svg width="24" height="25" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.86 2.5h8.28L22 8.36v8.28l-5.86 5.86H7.86L2 16.64V8.36L7.86 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="4 4" /></svg>
)
export const CircleEmptyIcon: React.FC = props => <Icon component={CircleEmptySvg} {...props} />

const CloseModalSvg = () => (
  <svg width="30" height="30" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="M15.108 29.4c7.953 0 14.4-6.447 14.4-14.4S23.061.6 15.108.6.708 7.047.708 15s6.447 14.4 14.4 14.4Zm-2.327-19.273a1.8 1.8 0 1 0-2.546 2.546L12.563 15l-2.328 2.327a1.8 1.8 0 1 0 2.546 2.546l2.327-2.327 2.328 2.327a1.8 1.8 0 0 0 2.545-2.546L17.654 15l2.327-2.327a1.8 1.8 0 1 0-2.546-2.546l-2.327 2.327-2.327-2.327Z" fill="currentColor" /></svg>
)
export const CloseModalIcon: React.FC<any> = props => <Icon component={CloseModalSvg} {...props} />

const ToastWarningSvg = () => (
  <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.36 1.5H15.64L21.5 7.36V15.64L15.64 21.5H7.36L1.5 15.64V7.36L7.36 1.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11.5 15.5H11.51" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11.5 7.5V11.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>

)
export const ToastWarningIcon: React.FC = props => <Icon component={ToastWarningSvg} {...props} />

const ToastSuccessSvg = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.86 1H15.14L21 6.86V15.14L15.14 21H6.86L1 15.14V6.86L6.86 1Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M16.5 7L9.28125 14.875L6 11.2955" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
export const ToastSuccessIcon: React.FC = props => <Icon component={ToastSuccessSvg} {...props} />

const SliderHomeSvg = () => (
  <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M9.995.08.08 7.56v12.32l19.86.05V7.56L9.996.08h-.001ZM1.577 18.387V8.307l8.42-6.353 8.446 6.353V18.43l-16.866-.043Z" fill="currentColor" fillRule="nonzero"/></svg>
)
export const SliderHomeIcon: React.FC = props => <Icon component={SliderHomeSvg} {...props} />

const SliderSpaceSvg = () => (
  <svg width="20" height="18" xmlns="http://www.w3.org/2000/svg"><path d="M18.344 0H1.654C.772 0 .058.714.058 1.598v13.85c0 .883.714 1.597 1.598 1.597h16.69c.884 0 1.598-.714 1.598-1.598V1.598C19.943.714 19.23 0 18.345 0h-.001ZM5.75 15.63H1.48V6.393h4.27v9.239Zm12.753 0H7.162V6.393h11.364c-.006 6.16-.015 9.239-.023 9.239Zm.023-10.44H1.48V1.423h17.046V5.19Z" fill="currentColor" fillRule="nonzero"/></svg>
)
export const SliderSpaceIcon: React.FC<any> = props => <Icon component={SliderSpaceSvg} {...props} />

const SliderInviteSvg = () => (
  <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg"><g fill="currentColor" fillRule="nonzero"><path d="M14.48.008a1.996 1.996 0 0 1 1.995 1.996v2.994h1.496a1.996 1.996 0 0 1 1.997 1.996V17.97a1.996 1.996 0 0 1-1.997 1.997H2.004A1.995 1.995 0 0 1 .008 17.97V6.994a1.996 1.996 0 0 1 1.996-1.996H3.5V2.004A1.996 1.996 0 0 1 5.497.008h8.982Zm3.991 9.227-7.402 5.842a1.746 1.746 0 0 1-2.164 0l-7.4-5.843v8.737a.501.501 0 0 0 .498.5h15.968a.499.499 0 0 0 .5-.5V9.235Zm-3.992-7.73H5.497a.5.5 0 0 0-.5.499v8.08l4.836 3.818a.25.25 0 0 0 .31 0l4.835-3.817V2.004a.5.5 0 0 0-.499-.5ZM3.5 6.495H2.004a.5.5 0 0 0-.5.499v.333l1.997 1.576V6.495H3.5Zm14.47 0h-1.496v2.407l1.996-1.575v-.333a.5.5 0 0 0-.5-.5Z"/><path d="M7.742 4.998a.748.748 0 1 1 0 1.497.748.748 0 0 1 0-1.497Zm2.496 0a.748.748 0 1 1 0 1.496.748.748 0 0 1 0-1.496Zm2.494 0a.749.749 0 1 1 0 1.497.749.749 0 0 1 0-1.497Z"/></g></svg>
)
export const SliderInviteIcon: React.FC<any> = props => <Icon component={SliderInviteSvg} {...props} />

const SliderShareSvg = () => (
  <svg className="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" width="20" height="20"><path d="M755.84 915.2H271.36c-74.24 0-134.4-60.16-134.4-134.4V295.68c0-74.24 60.16-134.4 134.4-134.4h236.8c17.92 0 32 14.08 32 32s-14.08 32-32 32h-236.8c-39.04 0-70.4 31.36-70.4 70.4V780.8c0 39.04 31.36 70.4 70.4 70.4h485.12c39.04 0 70.4-31.36 70.4-70.4V535.04c0-17.92 14.08-32 32-32s32 14.08 32 32V780.8c0 74.24-60.8 134.4-135.04 134.4zm103.04-553.6c-17.92 0-32-14.08-32-32V225.28H720c-17.92 0-32-14.08-32-32s14.08-32 32-32h138.88c17.92 0 32 14.08 32 32V329.6c0 17.92-14.72 32-32 32z" fill="currentColor"/><path d="M503.04 581.12c-8.32 0-16.64-3.2-22.4-9.6-12.8-12.8-12.8-32.64 0-45.44L814.72 192c12.8-12.8 32.64-12.8 45.44 0s12.8 32.64 0 45.44L525.44 572.16c-6.4 5.76-14.08 8.96-22.4 8.96z" fill="currentColor"/></svg>
)
export const SliderShareIcon: React.FC<any> = props => <Icon component={SliderShareSvg} {...props} />

const SliderHexagonSvg = () => (
  <svg className="icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M512 981.333a130.56 130.56 0 0 1-64-17.066L149.333 793.6a128 128 0 0 1-64-110.933V341.333a128 128 0 0 1 64-110.933L448 59.733a128 128 0 0 1 128 0L874.667 230.4a128 128 0 0 1 64 110.933v341.334a128 128 0 0 1-64 110.933L576 964.267a130.56 130.56 0 0 1-64 17.066zM512 128a42.667 42.667 0 0 0-21.333 5.973L192 304.64a42.667 42.667 0 0 0-21.333 36.693v341.334A42.667 42.667 0 0 0 192 719.36l298.667 170.667a42.667 42.667 0 0 0 42.666 0L832 719.36a42.667 42.667 0 0 0 21.333-36.693V341.333A42.667 42.667 0 0 0 832 304.64L533.333 133.973A42.667 42.667 0 0 0 512 128zm384 554.667z"/></svg>
)
export const SliderHexagonIcon: React.FC<any> = props => <Icon component={SliderHexagonSvg} {...props} />
