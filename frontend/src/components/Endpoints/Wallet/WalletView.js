import * as React from 'react';
import { MDBCard, MDBCol, MDBRow } from 'mdbreact';

import TabSlider                 from '../../UI/TabSlider';
import WalletActivity            from '../../Views/WalletActivity';

import WalletAAVEDetails         from '../../Views/WalletAAVEDetails';
import WalletAAVELending         from '../../Views/WalletAAVELending';
import WalletAAVEBorrowing       from '../../Views/WalletAAVEBorrowing';
import WalletAAVERepaying        from '../../Views/WalletAAVERepaying';
import WalletCompoundDetails     from '../../Views/WalletCompoundDetails';
import WalletCompoundLending     from '../../Views/WalletCompoundLending';
// import WalletCompoundBorrowing   from '../../Views/WalletCompoundBorrowing';
// import WalletCompoundRepaying    from '../../Views/WalletCompoundRepaying';
import WalletBalances            from '../../Views/WalletBalances';
import WalletBalanceChart        from '../../Views/WalletBalanceChart';
import WalletDetailsExpanded     from '../../Views/WalletDetailsExpanded';
import WalletOwnership           from '../../Views/WalletOwnership';
import WalletSend                from '../../Views/WalletSend';
import WalletUniswapV2           from '../../Views/WalletUniswapV2';


const WalletView = (props) =>
	<>
		<MDBRow>
		<MDBCol size='12' className='p-0'>

			<div className='pt-5'>
				<MDBCard className='z-depth-3'>
					<TabSlider
						entries={[
							{ label: 'Details',              render: <WalletDetailsExpanded {...props}/> },
						]}
					/>
				</MDBCard>
			</div>

			<div className='pt-5'>
				<MDBCard className='z-depth-3'>
					<TabSlider
						entries={[
							{ label: 'Send',                 render: <WalletSend            {...props}/> },
							{ label: 'Swap',                 render: <WalletUniswapV2       {...props}/> },
							{ label: 'Wallet ownership',     render: <WalletOwnership       {...props}/> },
						]}
					/>
				</MDBCard>
			</div>

			<div className='pt-5'>
				<MDBCard className='z-depth-3'>
					<TabSlider
						nopadding
						entries={[
							{
								label: 'AAVE',
								render:
									Object.values(props.details.tokens).find(({reserveData}) => reserveData)
									?
										<TabSlider
											entries={[
												{ label: 'Overview',             render: <WalletAAVEDetails                {...props} /> },
												{ label: 'Deposit',              render: <WalletAAVELending fixed          {...props} /> },
												{ label: 'Withdraw',             render: <WalletAAVELending fixed withdraw {...props} /> },
												{ label: 'Borrow',               render: <WalletAAVEBorrowing              {...props} /> },
												{ label: 'Repay',                render: <WalletAAVERepaying               {...props} /> },
											]}
										/>
									:
										<div className='text-center text-muted p-4'>AAVE is not available on this network</div>
							},
							{
								label: 'Compound',
								render:
									Object.values(props.details.tokens).find(({compound}) => compound)
									?
										<TabSlider
											entries={[
												{ label: 'Overview',             render: <WalletCompoundDetails                {...props} /> },
												{ label: 'Deposit',              render: <WalletCompoundLending fixed          {...props} /> },
												{ label: 'Withdraw',             render: <WalletCompoundLending fixed withdraw {...props} /> },
												// { label: 'Borrow',               render: <WalletCompoundBorrowing              {...props} /> },
												// { label: 'Repay',                render: <WalletCompoundRepaying               {...props} /> },
											]}
										/>
									:
										<div className='text-center text-muted p-4'>AAVE is not available on this network</div>
							},
						]}
					/>
				</MDBCard>
			</div>

			<div className='pt-5'>
				<MDBCard className='z-depth-3'>
					<TabSlider
						entries={[
							{ label: 'Balances',             render: <WalletBalances        {...props}/> },
							{ label: 'Chart',                render: <WalletBalanceChart    {...props}/> },
							{ label: 'Detailed activity',    render: <WalletActivity        {...props}/> },
						]}
					/>
				</MDBCard>
			</div>

			<div className='pt-5'/>

		</MDBCol>
		</MDBRow>
	</>

export default WalletView;
