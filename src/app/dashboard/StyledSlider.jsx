import Slider from "react-slick";
import styled from "styled-components";

export const StyledSlider = styled(Slider)`
      height: 75px;

      .slick-list {
			margin: 0 auto;
			padding: 80px 0px;
			
			// margin: 0;
			// padding: 0;
			
			position: relative;
	
			display: block;
			overflow: hidden;

			> .slick-track {
				position: relative; 
				top: 0;
				left: 0;
			
				display: block;
				margin-left: auto;
				margin-right: auto;
			}
      }

      .slick-slide > div {
         cursor: pointer;
      }
		



		h3 {
			color: yellow;
			font-size: 36px;
			line-height: 100px;
			margin: 10px;
			padding: 2%;
			position: relative;
			text-align: center;
		}
	
		.center .slick-center h3 {
			color: #e67e22;
			opacity: 1;
			-ms-transform: scale(1.08);
			transform: scale(1.08);
		}
   `;
