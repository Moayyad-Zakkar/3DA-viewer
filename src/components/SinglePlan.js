import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import sanityClient from "../client.js";
import Container from "./Container";
import ReactPlayer from "react-player";
import JawViewBox from "./JawViewsBox.js";
import Logo from "./Logo";
import Views from "./Views.js";
import PlayerButtons from "./PlayerButtons.js";
import PatientInfo from "./PatientInfo.js";
import Tabs from "./Tabs.js";

function SinglePlan() {
  const [planData, setplanData] = useState(null);
  const { slug } = useParams();
  const [view, setView] = useState("Front");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTab, setCurrentTab] = useState("videos");
  const player = useRef();
  useEffect(() => {
    sanityClient
      .fetch(
        `*[slug.current == $slug]{
            caseNum,
            patientName,
            doctorName,
            patientSheet,
            upperCount,
            lowerCount,
            estimatedTime,
  					logo {
              asset->{url}
                 },		
            sequence {
              front {
                    asset->{url}
                    },
              left{
                    asset->{url}
                    },
              right{
                    asset->{url}
                    },
              upper{
                    asset->{url}
                    },
              lower{
                    asset->{url}
                    },
            },
            beforeAfter {
              front {
                asset->{url}
                },
          left{
                asset->{url}
                },
          right{
                asset->{url}
                },
          upper{
                asset->{url}
                },
          lower{
                asset->{url}
                },
            },
                        slug
                     }`,
        { slug }
      )
      .then((data) => setplanData(data[0]))
      .catch(console.error);
  }, [slug]);

  if (!planData) return <div>Loading...</div>;

  // Change the Tab function

  const tabChanger = (tab) => {
    setCurrentTab(tab);
  };

  // Change the View function
  const viewChanger = (viewName) => {
    setView(viewName);
  };

  // Aligners Count
  const upperAligners = planData.upperCount;
  const lowerAligners = planData.lowerCount;

  // Patients Information
  const patientName = planData.patientName;
  let doctorName;
  if (planData.doctorName) {
    doctorName = planData.doctorName;
  }

  const caseNum = planData.caseNum;
  const patientSheet = planData.patientSheet;

  // Logo
  const logoLink = planData.logo?.asset.url;
  const estimatedTime = planData.estimatedTime;

  // Video Existence Checking Or Image Existence
  let lowerView, upperView, rightView, leftView;

  if (
    planData.sequence.lower?.asset.url ||
    planData.beforeAfter.lower?.asset.url
  ) {
    lowerView = true;
  } else {
    lowerView = false;
  }
  if (
    planData.sequence.upper?.asset.url ||
    planData.beforeAfter.upper?.asset.url
  ) {
    upperView = true;
  } else {
    upperView = false;
  }
  if (
    planData.sequence.right?.asset.url ||
    planData.beforeAfter.right?.asset.url
  ) {
    rightView = true;
  } else {
    rightView = false;
  }
  if (
    planData.sequence.left?.asset.url ||
    planData.beforeAfter.left?.asset.url
  ) {
    leftView = true;
  } else {
    leftView = false;
  }

  let videoSrc, imgSrc;

  if (view === "Front") {
    videoSrc = planData.sequence.front.asset.url;
    imgSrc = planData.beforeAfter?.front.asset.url;
  } else if (view === "Right") {
    videoSrc = planData.sequence.right.asset.url;
    imgSrc = planData.beforeAfter?.right.asset.url;
  } else if (view === "Left") {
    videoSrc = planData.sequence.left.asset.url;
    imgSrc = planData.beforeAfter?.left.asset.url;
  } else if (view === "Upper") {
    videoSrc = planData.sequence.upper.asset.url;
    imgSrc = planData.beforeAfter?.upper.asset.url;
  } else if (view === "Lower") {
    videoSrc = planData.sequence.lower.asset.url;
    imgSrc = planData.beforeAfter?.lower.asset.url;
  }

  // Video player Buttons functions
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const seekToStart = () => {
    setIsPlaying(false);
    player.current.seekTo(0);
  };
  const seekToEnd = async () => {
    await player.current.seekTo(0.99, "fraction");
    // setIsPlaying(false)
  };

  const seekOneSecForward = async () => {
    const currentTime = player.current.getCurrentTime();
    await player.current.seekTo(currentTime + 1, "seconds");
    // setIsPlaying(false)
  };

  const seekOneSecBackward = () => {
    setIsPlaying(false);
    const currentTime = player.current.getCurrentTime();
    player.current.seekTo(currentTime - 1, "seconds");
  };

  // JSX !!!

  return (
    <Content>
      <Logo logo={logoLink} />
      <Container>
        <PatientInfo
          name={patientName}
          caseNum={caseNum}
          patientSheet={patientSheet}
          doctorName={doctorName}
        />
        <Tabs currentTab={currentTab} tabChanger={tabChanger} />
        {currentTab === "videos" ? (
          <>
            <Views
              upperView={upperView}
              lowerView={lowerView}
              leftView={leftView}
              rightView={rightView}
              currentView={view}
              viewChanger={viewChanger}
            />
            <DataContainer>
              <ReactPlayer
                ref={player}
                playing={isPlaying}
                controls={false}
                onEnded={() => setIsPlaying(false)}
                url={videoSrc}
                width="100%"
                height="100%"
                loop={false}
              />
            </DataContainer>

            <PlayerButtons
              onPlayClick={togglePlay}
              playing={isPlaying}
              seekToStart={seekToStart}
              seekToEnd={seekToEnd}
              seekOneSecForward={seekOneSecForward}
              seekOneSecBackward={seekOneSecBackward}
            />
          </>
        ) : (
          <>
            <Views
              upperView={upperView}
              lowerView={lowerView}
              leftView={leftView}
              rightView={rightView}
              currentView={view}
              viewChanger={viewChanger}
            />
            <DataContainer>
              <DataImage src={imgSrc} alt="" />
            </DataContainer>
          </>
        )}
        {estimatedTime ? (
          <Estimated>
            Estimated treatment time:{" "}
            <EstimatedSpan>{estimatedTime}</EstimatedSpan> months
          </Estimated>
        ) : null}
        <JawViewBox upper={upperAligners} lower={lowerAligners} />
      </Container>
      <CopyRightText>
        3DA © 2021 - Designed by:{" "}
        <FooterLink href="https://github.com/Moayyad-Zakkar">
          Moayyad Zakkar
        </FooterLink>
      </CopyRightText>
    </Content>
  );
}

const FooterLink = styled.a`
  /* text-decoration: none; */
`;

const DataContainer = styled.div`
  height: 400px;
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  @media (max-width: 768px) {
    width: 100%;
    height: auto;
  }
`;

const DataImage = styled.img`
  max-height: 100%;
  width: 100%;
`;

const Content = styled.div`
  text-align: center;
  /* background-color: #e5e5e5; */
  background-color: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  //justify-content: flex-start;
  font-size: calc(10px + 2vmin);
  color: black;
`;
const CopyRightText = styled.p`
  /* color: #00adef;
    font-weight: bold; */
  margin: 1rem;
  font-size: 0.8rem;
`;

const Estimated = styled.p`
  /* color: #00adef;
    font-weight: bold; */
  margin: 0;
  font-size: 1rem;
`;

const EstimatedSpan = styled.span`
  color: #00adef;
  font-weight: bold;
  margin: 0;
  font-size: 1rem;
`;

export default SinglePlan;
