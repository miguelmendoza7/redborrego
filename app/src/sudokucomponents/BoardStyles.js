import styled from 'styled-components';

export const BoardWrapper = styled.div`
	.row-divider {
		border-bottom: 3px solid black;
	}
	.sudokuGrid {
		display: grid;
		width: 300px;
		height: 300px;
		margin: 0 auto;
		color: white;
		border: 1px solid black;
		.cell {
			border: 1px solid black;
			border-radius: 0px;

			font-family: Helvetica;
			font-weight: bold;
			font-size: 1rem;
			display: flex;
			justify-content: center;
			align-items: center;
			outline: none;
			input[type='text'] {
				position: relative;
				margin: 0;
				border: 0;
				width: 100%;
				height: 30px;
				text-align: center;
				font-size: 0.75rem;
				font-weight: 800;
				color: black ;

				font-family: Arial, Helvetica, sans-serif;
				:disabled {
					color: white ;
					width: 30px;
					height: 30px;
					background: none;
				}
			}
		}
		.row-divider {
			border-bottom: 5px solid black;
		}
		.col-divider {
			border-right: 5px solid black;
		}
		.collided, .collided input[type='text'] {
			background: #e55252;
			color: #fff;
		}
		grid-template-columns: repeat(9, 1fr);
		padding: 0px;
	}

	@media screen and (min-width: 1024px){
 
		.sudokuGrid {
			width: 400px;
			height: 400px;
			
			.cell {
				border-radius: 0px;
				border: 1px solid black;
				
				input[type='text'] {
					height: 38px;
					font-size: 1rem;
					color: black ;

					:disabled {
						color: white ;
						width: 38px;
						height: 38px;
						background: none;
					}
					
				
				}
		  }


		  .col-divider {
			border-right: 10px solid black;
		}

	
		.row-divider {
			border-bottom: 10px solid black;
		}


	
		
		  
	}
`;