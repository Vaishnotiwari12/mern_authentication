import { Alert, AlertIcon, Center, Heading, Text, Box, Button } from "@chakra-ui/react";
import { useState } from "react";
import useAuth from "../hooks/useAuth";

const Profile = () => {
  const { user } = useAuth();
  const { email, verified, createdAt } = user;

  // Simulate a flag to check if the user is new (this can come from the backend or signup process)
  const [isNewUser, setIsNewUser] = useState(true);

  return (
    <Center mt={16} flexDir="column">
      {isNewUser ? (
        <Box textAlign="center" p={6} bg="gray.700" borderRadius="lg" boxShadow="lg">
          <Heading mb={4} color="white">
            Welcome to Your Profile!
          </Heading>
          <Text color="gray.300" mb={4}>
            Thank you for signing up! Please explore your account and verify your email to unlock all features.
          </Text>
          {!verified && (
            <Alert status="warning" w="fit-content" borderRadius={12} mb={3}>
              <AlertIcon />
              Please verify your email
            </Alert>
          )}
          <Button colorScheme="blue" onClick={() => setIsNewUser(false)}>
            Go to Profile
          </Button>
        </Box>
      ) : (
        <>
          <Heading mb={4}>My Account</Heading>
          {!verified && (
            <Alert status="warning" w="fit-content" borderRadius={12} mb={3}>
              <AlertIcon />
              Please verify your email
            </Alert>
          )}
          <Text color="white" mb={2}>
            Email:{" "}
            <Text as="span" color="gray.300">
              {email}
            </Text>
          </Text>
          <Text color="white">
            Created on{" "}
            <Text as="span" color="gray.300">
              {new Date(createdAt).toLocaleDateString("en-US")}
            </Text>
          </Text>
        </>
      )}
    </Center>
  );
};

export default Profile;