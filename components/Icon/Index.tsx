import Icon from '@ant-design/icons';

const EmailSvg = () => (
  <svg className="icon-svg" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1715" width="200" height="200"><path d="M513 583.8l448.5-448.5c-11.6-4.7-24.3-7.3-37.5-7.3H100c-12.7 0-24.9 2.4-36.1 6.7L513 583.8z" fill="" p-id="1716"></path><path d="M513 674.3L14.6 175.9C5.3 191.1 0 208.9 0 228v568c0 55.2 44.8 100 100 100h824c55.2 0 100-44.8 100-100V228c0-18.5-5.1-35.9-13.9-50.8L513 674.3z" fill="" p-id="1717"></path></svg>
);
export const EmailIcon: React.FC = props => <Icon component={EmailSvg} {...props} />;

const USvg = () => (
  <svg className="icon-svg" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10411" width="200" height="200"><path d="M870.515838 62.986543l0 565.154617c0 111.332644-31.92613 194.434318-95.733365 249.309112-60.59303 51.635007-147.84728 77.449953-261.761726 77.449953-50.895157 0-96.941889-6.460132-138.14736-19.371186-56.559157-17.742083-102.605889-46.37419-138.149407-85.913718-45.249577-50.823526-67.858504-121.005958-67.858504-210.568786L168.865477 62.986543l185.411827 0 0 563.791573c0 57.271378 14.538111 100.631932 43.62252 130.062218 29.084409 29.443589 66.231447 44.155662 111.48921 44.155662 60.59303 0 105.011682-14.112416 133.299959-42.341341 28.27088-28.230971 42.412972-69.37709 42.412972-123.412774L685.101965 62.986543 870.515838 62.986543z" p-id="10412"></path></svg>
);
export const UIcon: React.FC = props => <Icon component={USvg} {...props} />;

const SearchSvg = () => (
  <svg width="18" height="20" fill="none" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" clipRule="evenodd" d="m12.71 13.877 3.268 3.836-.567.487-3.278-3.835a6.14 6.14 0 0 1-3.809 1.284 6.204 6.204 0 0 1-2.458-.5 6.337 6.337 0 0 1-2.02-1.347 6.335 6.335 0 0 1-1.346-2.02A6.204 6.204 0 0 1 2 9.325c0-.856.167-1.675.5-2.458a6.335 6.335 0 0 1 1.347-2.02A6.334 6.334 0 0 1 5.867 3.5 6.203 6.203 0 0 1 8.323 3c.857 0 1.676.167 2.459.5a6.333 6.333 0 0 1 2.02 1.347 6.336 6.336 0 0 1 1.345 2.02c.334.782.5 1.601.5 2.457 0 .88-.17 1.713-.513 2.498a6.33 6.33 0 0 1-1.426 2.055zm-4.385 1.028c1.01 0 1.942-.25 2.799-.749a5.548 5.548 0 0 0 2.032-2.033c.5-.856.749-1.789.749-2.799s-.25-1.942-.748-2.799a5.549 5.549 0 0 0-2.033-2.033 5.461 5.461 0 0 0-2.8-.748c-1.01 0-1.942.25-2.799.748a5.548 5.548 0 0 0-2.032 2.033 5.461 5.461 0 0 0-.749 2.8c0 1.01.25 1.942.749 2.799a5.547 5.547 0 0 0 2.032 2.032c.857.5 1.79.749 2.8.749z" fill="currentColor" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg>
);
export const SearchIcon: React.FC = props => <Icon component={SearchSvg} {...props} />;

const SwitchVerticalSvg = () => (
  <svg width="18" height="18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.25 12V3m0 0-3 3m3-3 3 3m4.5 0v9m0 0 3-3m-3 3-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
export const SwitchVerticalIcon: React.FC = props => <Icon component={SwitchVerticalSvg} {...props} />;

const BookmarkSvg = () => (
  <svg width="18" height="19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 5.556C4 4.696 4.696 4 5.556 4h7.777c.86 0 1.556.696 1.556 1.556V18l-5.445-2.722L4 18V5.556z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
export const BookmarkIcon: React.FC = props => <Icon component={BookmarkSvg} {...props} />;

const ArrowTopLeftSvg = () => (
  <svg width="18" height="24" viewBox="0 0 18 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M14 17L4 7" stroke="currentColor" strokeWidth="2.13983" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 17V7H14" stroke="currentColor" strokeWidth="2.13983" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
export const ArrowTopLeftIcon: React.FC = props => <Icon component={ArrowTopLeftSvg} {...props} />;

const InviteSvg = () => (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 2V6M2 4H6M5 16V20M3 18H7M12 2L14.2857 8.85714L20 11L14.2857 13.1429L12 20L9.71429 13.1429L4 11L9.71429 8.85714L12 2Z" stroke="currentColor" strokeWidth="2.14" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
export const InviteIcon: React.FC = props => <Icon component={InviteSvg} {...props} />;

const LogoutSvg = () => (
  <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8.11111 15.6667L4.55556 12.1111M4.55556 12.1111L8.11111 8.55556M4.55556 12.1111L17 12.1111M12.5556 15.6667V16.5556C12.5556 18.0283 11.3616 19.2222 9.88889 19.2222H3.66667C2.19391 19.2222 1 18.0283 1 16.5556V7.66667C1 6.19391 2.19391 5 3.66667 5H9.88889C11.3616 5 12.5556 6.19391 12.5556 7.66667V8.55556" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
export const LogoutIcon: React.FC = props => <Icon component={LogoutSvg} {...props} />;

const SortTopSvg = () => (
  <svg width="18" height="16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1h11.375M1 4.5h7.875M1 8h5.25m3.5 0 3.5-3.5m0 0 3.5 3.5m-3.5-3.5V15" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
export const SortTopIcon: React.FC = props => <Icon component={SortTopSvg} {...props} />;

const SortDoneSvg = () => (
  <svg width="16" height="14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15.108 12.75h-13m13-4h-13m13-4h-6m-2-3.5-4 4-2.5-2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
);
export const SortDoneIcon: React.FC = props => <Icon component={SortDoneSvg} {...props} />;