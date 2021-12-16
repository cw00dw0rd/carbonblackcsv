# Carbon Black to CSV

## What is the project?
This is a project that was given to me by a friend who is a security professional in need of a tool to access reports due to a pending issue with the Carbon Black UI.
The issue was specifically with being unable to export KillChain reports from the UI, so he was referred to the API until they resolved the issue. 
After exploring the API and working with Carbon Black, we found the API doesn't actually support pulling the needed 'Alerts' yet, just the 'Events'. This would mean that we would need to pull millions of events and then parse the alerts out of them. This functionality, while technically possible, is not efficient or supported with the API. 

## So why is the project here?
Great question! I am developer that loves to learn, so even though the original goal couldn't be met I used it as a learning opportunity. Overall, I learned how to use Electron, access a well known 3rd party API, and package an app for distribution(see the release-builds folder) with basic design and layout requests. 

## How does it work?
Currently, due to the nature of the content supplied, you must supply your own API information. That means, if you were to install the application all you immediately have access to is putting in the API info and no actual fetch will be made without it. However, have a look at the source and you will see a fully functional program. The process involves getting API data from user, making the fetch with the API Key to the API address supplied(CSP set to allow Carbon Black URL only), retrieving the first 100 events, parsing useful data that correlates to the KillChain report, and exports that to a CSV file that is saved via Dialog Box.


## What now?
I hope you can get some benefit out of this application. If you use Carbon Black Defense and think that maybe this application could be made a bit more useful, I'd love to give it some functionality. This will be a part of my portfolio as well and as of the time of this commit, I am searching for a new job, so please reach out to me if you'd like me on your team!! 
