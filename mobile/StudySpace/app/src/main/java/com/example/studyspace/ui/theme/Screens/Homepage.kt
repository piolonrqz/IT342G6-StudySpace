@Composable
fun HomeScreen(navHostController: NavHostController) {
    var selectedItem by remember { mutableStateOf(0) }

    Box(modifier = Modifier.fillMaxSize()) {
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 16.dp, bottom = 70.dp) // leave space for bottom nav
        ) {
            // Top bar with profile and location
            item {
                Spacer(modifier = Modifier.height(16.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    // Profile image
                    Image(
                        painter = painterResource(id = R.drawable.profile),
                        contentDescription = "Profile Picture",
                        modifier = Modifier
                            .size(50.dp)
                            .clip(CircleShape),
                        contentScale = ContentScale.Crop
                    )

                    // Location info
                    Column(
                        horizontalAlignment = Alignment.End
                    ) {
                        Text(
                            text = "Your location",
                            fontSize = 12.sp,
                            color = Color.Gray
                        )
                        Row(
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                imageVector = Icons.Default.LocationOn,
                                contentDescription = null,
                                tint = Color(0xFF3498DB),
                                modifier = Modifier.size(16.dp)
                            )
                            Text(
                                text = "North Europe Luzon",
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Medium
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(24.dp))
                Text(
                    text = "Hello, Heaven",
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = "\"Find Your Perfect Study & Work Space\"",
                    fontSize = 14.sp,
                    color = Color.Gray
                )

                Spacer(modifier = Modifier.height(16.dp))
                OutlinedTextField(
                    value = "",
                    onValueChange = {},
                    placeholder = { Text("Search address, city, name") },
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 8.dp),
                    shape = RoundedCornerShape(24.dp),
                    leadingIcon = {
                        Icon(
                            imageVector = Icons.Default.Search,
                            contentDescription = "Search",
                            tint = Color.Gray
                        )
                    },
                    trailingIcon = {
                        Icon(
                            painter = painterResource(id = R.drawable.filter),
                            contentDescription = "Filter",
                            tint = Color.Gray
                        )
                    },
                    colors = TextFieldDefaults.colors(
                        unfocusedContainerColor = Color(0xFFF5F5F5),
                        focusedContainerColor = Color(0xFFF5F5F5),
                        unfocusedIndicatorColor = Color.Transparent,
                        focusedIndicatorColor = Color.Transparent
                    ),
                    singleLine = true
                )
            }

            // Top Rated
            item {
                Spacer(modifier = Modifier.height(24.dp))
                SpaceCategory(title = "Top Rated", spaces = topRatedSpaces)
            }

            // Quiet & Focused
            item {
                Spacer(modifier = Modifier.height(16.dp))
                SpaceCategory(title = "Quiet & Focused", spaces = quietSpaces)
            }

            // 24/7 Access
            item {
                Spacer(modifier = Modifier.height(16.dp))
                SpaceCategory(title = "24/7 Access", spaces = accessSpaces)
                Spacer(modifier = Modifier.height(80.dp)) // extra bottom padding
            }
        }

        // Footer Navigation Bar
        NavigationBar(
            containerColor = Color(0xFFF8F877),
            modifier = Modifier.align(Alignment.BottomCenter)
        ) {
            val items = listOf(
                Pair(Icons.Default.Home, "Home"),
                Pair(Icons.Default.Search, "Booking"),
                Pair(Icons.Default.Person, "Profile")
            )

            items.forEachIndexed { index, item ->
                NavigationBarItem(
                    icon = { Icon(item.first, contentDescription = item.second) },
                    label = { Text(item.second) },
                    selected = selectedItem == index,
                    onClick = {
                        selectedItem = index
                        when (index) {
                            0 -> navHostController.navigate("home") { launchSingleTop = true }
                            1 -> navHostController.navigate("booking") { launchSingleTop = true }
                            2 -> navHostController.navigate("profile") { launchSingleTop = true }
                        }
                    }
                )
            }
        }
    }
}
