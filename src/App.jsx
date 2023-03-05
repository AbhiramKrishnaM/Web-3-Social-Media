import { useEffect, useState } from "react";

import {
  urlClient,
  LENS_HUB_CONTRACT_ADDRESS,
  queryRecommendedProfiles,
  queryExplorepublications,
} from "./queries";

import LENSHUB from "./lenshub.json";

import { ethers } from "ethers";

import { Avatar, Box, Button, Image } from "@chakra-ui/react";

function App() {
  const [account, setAccount] = useState(null);
  const [profiles, setProfiles] = useState([]);

  const [posts, setPosts] = useState([]);
  console.log(posts);

  async function signIn() {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setAccount(accounts[0]);
  }

  async function getRecommendedProfiles() {
    const response = await urlClient
      .query(queryRecommendedProfiles)
      .toPromise();

    const profiles = response.data.recommendedProfiles.slice(0, 5);

    setProfiles(profiles);
  }

  async function getPosts() {
    const response = await urlClient
      .query(queryExplorepublications)
      .toPromise();
    const posts = response.data.explorePublications.items.filter((post) => {
      if (post.profile) return post;
      return "";
    });

    setPosts(posts);
  }

  async function follow(id) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(
      LENS_HUB_CONTRACT_ADDRESS,
      LENSHUB,
      provider.getSigner()
    );

    const tx = await contract.follow([parseInt(id)], [0x0]);
    await tx.wait();
  }

  useEffect(() => {
    getRecommendedProfiles();
    getPosts();
  }, []);

  return (
    <div>
      <Box width="100%" backgroundColor="rgba(5,32,64,8)">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          width="50%"
          m="auto"
          color="white"
          p="10px 0"
        >
          <Box>
            <Box fontSize={44} fontWeight="light">
              I3D
            </Box>
            <Box>Decentralized Social Media Aplication</Box>
          </Box>

          {account ? (
            <Button colorScheme="facebook">Connected</Button>
          ) : (
            <Button colorScheme="gray" color="rgba(5,32,64,8)" onClick={signIn}>
              Connect
            </Button>
          )}
        </Box>
      </Box>

      {/* Content */}
      <Box
        display="flex"
        width="50%"
        justifyContent="space-between"
        m="35px auto auto auto"
        color="white"
      >
        {/* Posts */}
        <Box width="65%" maxW="65%" minW="65%">
          {posts.map((post) => (
            <Box
              key={post.id}
              marginBottom="25px"
              backgroundColor="rgba(5,32, 64, 28)"
              padding="40px"
              borderRadius="6px"
            >
              <Box display="flex">
                <Avatar
                  src={`${post?.profile?.coverPicture?.original?.url}`}
                ></Avatar>

                <Box flexGrow={1} marginLeft="20px">
                  <Box>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      _hover={{ cursor: "pointer" }}
                    >
                      <Box>{post.profile?.handle}</Box>
                      <Box onClick={() => follow(post.id)}>Follow</Box>
                    </Box>
                  </Box>

                  <Box overflowWrap="anywhere" marginTop={5}>
                    {post.metadata?.content}
                  </Box>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>

        {/* Friend Suggestions */}
        <Box></Box>
      </Box>
    </div>
  );
}

export default App;
