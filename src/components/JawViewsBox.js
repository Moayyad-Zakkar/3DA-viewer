import React from 'react'
import styled from 'styled-components'
import JawView from './JawView'
import maxilla from '../assets/imgs/views/aligner-info-upper.svg'; 
import mandible from '../assets/imgs/views/aligner-info-lower.svg'; 


const jaws = {
    maxilla,
    mandible,
}

const JawViewBox = ({upper, lower}) => {
    return (
        <Flex>
           {upper ? <JawView name="Upper Aligners" jawImg={jaws.maxilla} upperCount={upper} /> : null}
           {lower ? <JawView name="Lower Aligners" jawImg={jaws.mandible} lowerCount={lower} /> : null }
        </Flex>
    )
}

const Flex = styled.div`
display: grid;
grid-auto-flow: column;
align-items: center;
text-align: center;
justify-content: space-between;
margin: 2rem;
`

export default JawViewBox;