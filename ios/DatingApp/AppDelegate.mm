// AppDelegate.m

#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>
#import "StreamVideoReactNative.h"
#import "RNSplashScreen.h"
#import <AuthenticationServices/AuthenticationServices.h>
#import <SafariServices/SafariServices.h>
#import <FBSDKCoreKit/FBSDKCoreKit-Swift.h>
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <FirebaseCore/FirebaseCore.h>
#import <FirebaseMessaging/FirebaseMessaging.h>
#import <UserNotifications/UserNotifications.h>

@interface AppDelegate () <UNUserNotificationCenterDelegate, FIRMessagingDelegate>
@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  [FIRApp configure];
  self.moduleName = @"DatingApp";
  self.initialProps = @{};

  [[FBSDKApplicationDelegate sharedInstance] application:application didFinishLaunchingWithOptions:launchOptions];
  [StreamVideoReactNative setup];
  [super application:application didFinishLaunchingWithOptions:launchOptions];
  [RNSplashScreen hide];

  // Request notification permissions
  if (@available(iOS 10.0, *)) {
    [UNUserNotificationCenter currentNotificationCenter].delegate = self;
    UNAuthorizationOptions authOptions = UNAuthorizationOptionAlert |
                                          UNAuthorizationOptionSound | UNAuthorizationOptionBadge;
    [[UNUserNotificationCenter currentNotificationCenter]
        requestAuthorizationWithOptions:authOptions
                      completionHandler:^(BOOL granted, NSError * _Nullable error) {
                        // Handle error if necessary
                      }];
  } else {
    UIUserNotificationType allNotificationTypes =
    (UIUserNotificationTypeSound | UIUserNotificationTypeAlert | UIUserNotificationTypeBadge);
    UIUserNotificationSettings *settings =
    [UIUserNotificationSettings settingsForTypes:allNotificationTypes categories:nil];
    [application registerUserNotificationSettings:settings];
  }

  [application registerForRemoteNotifications];
  [FIRMessaging messaging].delegate = self;

  return YES;
}

// Handle APNS token registration
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken {
  [FIRMessaging messaging].APNSToken = deviceToken;
}

// Handle APNS token registration failure
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error {
  NSLog(@"Failed to register for remote notifications: %@", error);
}

// FIRMessagingDelegate method to handle FCM token
- (void)messaging:(FIRMessaging *)messaging didReceiveRegistrationToken:(NSString *)fcmToken {
  NSLog(@"FCM registration token: %@", fcmToken);
  // Notify about received token.
  NSDictionary *dataDict = [NSDictionary dictionaryWithObject:fcmToken forKey:@"token"];
  [[NSNotificationCenter defaultCenter] postNotificationName:@"FCMToken" object:nil userInfo:dataDict];
}

// Handle notification while app is in foreground
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
       willPresentNotification:(UNNotification *)notification
         withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler {
  completionHandler(UNNotificationPresentationOptionAlert | UNNotificationPresentationOptionSound | UNNotificationPresentationOptionBadge);
}

// Handle notification response (when user taps on the notification)
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
didReceiveNotificationResponse:(UNNotificationResponse *)response
         withCompletionHandler:(void(^)(void))completionHandler {
  completionHandler();
}

- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
  return [[FBSDKApplicationDelegate sharedInstance] application:app openURL:url options:options];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge {
  return [self getBundleURL];
}

- (NSURL *)getBundleURL {
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
